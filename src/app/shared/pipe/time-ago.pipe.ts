import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(date: Date | string, lang?: 'en' | 'ar'): string {
    lang =
      lang ?? (localStorage.getItem('lang')?.startsWith('ar') ? 'ar' : 'en');

    const now = Date.now();
    const past = new Date(date).getTime();
    const diffSec = Math.floor((now - past) / 1000);
    if (diffSec < 0) return lang === 'ar' ? 'بعد قليل' : 'soon';

    const units = {
      en: [
        { max: 60, text: 'just now' },
        { max: 3600, sec: 60, singular: 'minute ago', plural: 'minutes ago' },
        { max: 86400, sec: 3600, singular: 'hour ago', plural: 'hours ago' },
        { max: 604800, sec: 86400, singular: 'day ago', plural: 'days ago' },
        {
          max: 2592000,
          sec: 604800,
          singular: 'week ago',
          plural: 'weeks ago',
        },
        {
          max: 31536000,
          sec: 2592000,
          singular: 'month ago',
          plural: 'months ago',
        },
        {
          max: Infinity,
          sec: 31536000,
          singular: 'year ago',
          plural: 'years ago',
        },
      ],
      ar: [
        { max: 60, text: 'الآن' },
        { max: 3600, sec: 60, singular: 'قبل دقيقة', plural: 'قبل دقائق' },
        { max: 86400, sec: 3600, singular: 'قبل ساعة', plural: 'قبل ساعات' },
        { max: 604800, sec: 86400, singular: 'قبل يوم', plural: 'قبل أيام' },
        {
          max: 2592000,
          sec: 604800,
          singular: 'قبل أسبوع',
          plural: 'قبل أسابيع',
        },
        {
          max: 31536000,
          sec: 2592000,
          singular: 'قبل شهر',
          plural: 'قبل شهور',
        },
        {
          max: Infinity,
          sec: 31536000,
          singular: 'قبل سنة',
          plural: 'قبل سنوات',
        },
      ],
    };

    const list = units[lang as 'en' | 'ar'];

    for (const unit of list) {
      if (diffSec < unit.max) {
        if (unit.text) return unit.text;

        const value = Math.floor(diffSec / (unit.sec ?? 1));
        return lang === 'en'
          ? value === 1
            ? unit.singular!
            : `${value} ${unit.plural!}`
          : value === 1
          ? unit.singular!
          : `${value} ${unit.plural!}`;
      }
    }
    return '';
  }
}
