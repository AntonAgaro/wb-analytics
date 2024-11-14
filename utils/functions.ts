import type { NitroFetchOptions } from 'nitropack';
import type { AjaxResponse } from '~/types/AjaxResponse';
import type { FetchOptions } from 'ofetch';

export const clientFetch = async (url: string, options: NitroFetchOptions<any> = {}) => {
  const messageBuilder = useToast();
  const res =  await $fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  }).catch((e) => {
    if (e.data.message) {
      messageBuilder.add({ title: e.data.message, color: 'red' });
    }
  });

  const data = res as AjaxResponse || {};
  
  if (data.message) {
    messageBuilder.add({ title: data.message, color: 'green' });
  }

  return data;
};

export const serverFetch = async (url: string, params: NitroFetchOptions<any> = {}, callbacks?: {
  onRequest?: (request: RequestInfo, options: FetchOptions<any>) => void;
  onRequestError?: (request: RequestInfo, options: FetchOptions<any>, error: any) => void;
  onResponse?: (request: RequestInfo, response: Response, options: FetchOptions<any>) => void;
  onResponseError?: (request: RequestInfo, response: Response, options: FetchOptions<any>) => void;
}) => {
  const { data } = await useFetch(url, {
    onRequest({ request, options }) {
      callbacks?.onRequest?.(request, options);
    },
    onRequestError({ request, options, error }) {
      callbacks?.onRequestError?.(request, options, error);
      console.error('Request Error: ', error);
    },
    onResponse({ request, response, options }) {
      callbacks?.onResponse?.(request, response, options);
    },
    onResponseError({ request, response, options }) {
      callbacks?.onResponseError?.(request, response, options);
      console.error('Response Error: ', response);
    },
    headers: {
      'Content-Type': 'application/json'
    },
    ...params,
  });

  return data.value as AjaxResponse || {};
};


export function getFormateedDate(): string {
  const date = new Date();
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}