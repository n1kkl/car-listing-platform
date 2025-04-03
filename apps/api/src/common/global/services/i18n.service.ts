import { Injectable } from '@nestjs/common';
import {
  I18nService as OriginalService,
  Path,
  PathValue,
  TranslateOptions,
} from 'nestjs-i18n';
import { IfAnyOrNever } from 'nestjs-i18n/dist/types';
import { Context } from '../context';

@Injectable()
export class I18nService<K = Record<string, unknown>> {
  constructor(
    private readonly ctx: Context,
    private readonly originalI18n: OriginalService<K>,
  ) {}

  t<P extends Path<K> = any, R = PathValue<K, P>>(
    key: P,
    args?: TranslateOptions['args'],
    options: TranslateOptions = {},
  ): IfAnyOrNever<R, string, R> {
    options.lang = this.ctx.lang;
    if (args) {
      options.args = args;
    }
    return this.originalI18n.t<P, R>(key, options);
  }
}
