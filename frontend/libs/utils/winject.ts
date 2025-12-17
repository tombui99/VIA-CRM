/* eslint-disable @typescript-eslint/no-explicit-any */
import { firstValueFrom, Observable } from 'rxjs';

import type { HttpEvent, HttpResponse } from '@angular/common/http';
import type { InjectionToken, Type } from '@angular/core';
import { inject } from '@angular/core';

/*
  ok so this util takes angular services built with observables and converts them to promises

  things i had to brush up on to make this work:
  - function overloads: https://typescriptlang.org/docs/handbook/2/functions.html#function-overloads
  - variadic tuple types: https://typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types
  - inference: https://typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types
  - proxy pattern: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
*/

// unwrap observable<T> to t (promises want a single value, not a stream)
type UnwrapObservable<T> = T extends Observable<infer R> ? R : T;

// extract the body type from httpevent<T> | httpresponse<T> | t
type ExtractBody<T> = T extends HttpEvent<infer U> ? U : T extends HttpResponse<infer U> ? U : T;

type ObserveLiteral = 'body' | 'response' | 'events';

// find the first parameter that looks like 'observe' value ('body' | 'response' | 'events')
// we keep the head and tail so we can reconstruct overloads later
type FindObserve<P extends unknown[], Acc extends unknown[] = []> = P extends [infer F, ...infer R]
  ? F extends ObserveLiteral | undefined
    ? [Acc, F, R]
    : FindObserve<R, [...Acc, F]>
  : never;

// build promise overloads for methods that have an 'observe' parameter.
// we preserve:
// - the head (params before 'observe')
// - the tail (reportprogress, options, and whatever else the generator threw in)
// and we expose promise-based overloads for 'body' | undefined, 'response', and 'events'.
type MethodWithObserveOverloads<H extends unknown[], T extends unknown[], Body> = {
  (...args: [...H, ...T]): Promise<Body>;
  (...args: [...H, observe: undefined, ...T]): Promise<Body>;
  (...args: [...H, observe: 'body', ...T]): Promise<Body>;
  (...args: [...H, observe: 'response', ...T]): Promise<HttpResponse<Body>>;
  (...args: [...H, observe: 'events', ...T]): Promise<HttpEvent<Body>>;
};

// promisify a single method while preserving httpclient style 'observe' overloads.
// 1) if the function declares at least three overloads (body/response/events), mirror those as promises.
// 2) otherwise, detect an 'observe' param by position (variadic tuples to the rescue) and synthesize overloads.
// 3) otherwise, if it just returns an observable, convert it to a promise of its inner value.
type PromisifyMethod<F> = F extends {
  (...args: infer P1): infer R1;
  (...args: infer P2): infer R2;
  (...args: infer P3): infer R3;
  (...args: any[]): any;
}
  ? {
      (...args: P1): Promise<UnwrapObservable<R1>>;
      (...args: P2): Promise<UnwrapObservable<R2>>;
      (...args: P3): Promise<UnwrapObservable<R3>>;
    }
  : F extends (...args: infer P) => infer R
  ? R extends Observable<infer O>
    ? FindObserve<P> extends [infer H extends unknown[], any, infer T extends unknown[]]
      ? MethodWithObserveOverloads<H, T, ExtractBody<O>>
      : (...args: P) => Promise<UnwrapObservable<R>>
    : F
  : F;

type WrappedService<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? PromisifyMethod<T[K]> : T[K];
};

function wrapService<T>(service: T): WrappedService<T> {
  return new Proxy(service as object, {
    get(target, prop, receiver) {
      const originalMember = Reflect.get(target, prop, receiver) as unknown;
      if (typeof originalMember !== 'function') {
        return originalMember;
      }
      // if it looks like an observable and quacks like an observable, we firstvaluefrom it;
      // otherwise we just return the thing untouched
      return (...args: unknown[]) => {
        const result = (originalMember as (...a: unknown[]) => unknown).apply(target, args);
        const maybeObservable = result as { subscribe?: unknown } | undefined | null;
        if (maybeObservable && typeof maybeObservable.subscribe === 'function') {
          return firstValueFrom(result as Observable<unknown>);
        }
        return result;
      };
    },
  }) as unknown as WrappedService<T>;
}

/**
 * Inject and promisify an Angular service
 *
 * @template T The service type to inject and wrap
 * @param token The injection token (service class or InjectionToken) to resolve
 * @returns A wrapped version of the service where Observable methods return Promises
 */
export function winject<T>(token: Type<T> | InjectionToken<T>): WrappedService<T> {
  const instance = inject(token);
  return wrapService(instance);
}
