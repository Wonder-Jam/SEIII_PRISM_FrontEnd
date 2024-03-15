export const throttle =<T extends unknown[]> (callback:(...args:T) => void,delay:number = 500) => {
    let timeId: null | ReturnType<typeof setTimeout> = null
    let lastExcuteTime:number = 0
    return (...args:T) => {
        const currentTime = Date.now()
        if(currentTime - lastExcuteTime < delay){
            return
        }
        if(timeId) {
            clearTimeout(timeId)
        }
        lastExcuteTime = currentTime
        timeId = setTimeout(() => {
            callback(...args)
        }, delay);
    }
}

export const throttleImmediately = <T extends unknown[]>(callback:(...args:T)=>void,delay:number = 500) => {
    let timeId: null | ReturnType<typeof setTimeout> = null
    let lastExcuteTime = 0
    let showExcuteImmediately = true
    return (...args:T) => {
        let currentTime = Date.now()
        if(showExcuteImmediately){
            callback(...args)
            lastExcuteTime = currentTime
            showExcuteImmediately = false
        }else if(currentTime - lastExcuteTime > delay){
            callback(...args)
            lastExcuteTime = currentTime
        }else{
            if(timeId) clearTimeout(timeId)
            timeId = setTimeout(() => {
                callback(...args)
            }, delay);
        }
    }
}