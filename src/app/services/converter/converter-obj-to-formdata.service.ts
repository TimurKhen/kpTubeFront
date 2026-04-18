import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ConverterObjToFormdataService {
  objectToFormData(obj: any): FormData {
    const formData = new FormData()

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key]

        if (value === null || value === undefined) {
          continue
        }

        if (value instanceof File) {
          formData.append(key, value, value.name)
        }
        else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value))
        }
        else {
          formData.append(key, String(value))
        }
      }
    }

    return formData
  }
}
