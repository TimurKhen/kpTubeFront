import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'timeAgoPipe',
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: Date | undefined): string {
    if (!value) return ''
    
    const now = new Date()
    const delta = now.getTime() - value.getTime()

    if (delta < 60 * 60 * 1000) {
      return 'сейчас'
    }
    
    if (delta < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(delta / (60 * 60 * 1000))
      return `${hours} ${this.declineHour(hours)}`
    }
    
    if (delta < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(delta / (24 * 60 * 60 * 1000))
      return `${days} ${this.declineDay(days)}`
    }
    
    if (delta < 30 * 24 * 60 * 60 * 1000) {
      const weeks = Math.floor(delta / (7 * 24 * 60 * 60 * 1000))
      return `${weeks} ${this.declineWeek(weeks)}`
    }
    
    if (delta < 365 * 24 * 60 * 60 * 1000) {
      const months = Math.floor(delta / (30 * 24 * 60 * 60 * 1000))
      return `${months} ${this.declineMonth(months)}`
    }
    
    const years = Math.floor(delta / (365 * 24 * 60 * 60 * 1000))
    return `${years} ${this.declineYear(years)}`
  }
    
    private declineHour(hours: number): string {
      if (hours === 1) return 'час'
      if (hours >= 2 && hours <= 4) return 'часа'
      return 'часов'
    }
    
    private declineDay(days: number): string {
      if (days === 1) return 'день'
      if (days >= 2 && days <= 4) return 'дня'
      return 'дней'
    }
    
    private declineWeek(weeks: number): string {
      if (weeks === 1) return 'неделю'
      if (weeks >= 2 && weeks <= 4) return 'недели'
      return 'недель'
    }
    
    private declineMonth(months: number): string {
      if (months === 1) return 'месяц'
      if (months >= 2 && months <= 4) return 'месяца'
      return 'месяцев'
    }
    
    private declineYear(years: number): string {
      if (years === 1) return 'год'
      if (years >= 2 && years <= 4) return 'года'
      return 'лет'
    }

}
