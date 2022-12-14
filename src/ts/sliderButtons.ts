const forSlider: HTMLElement | null = document.querySelector('.for-slider')
const fieldServices: HTMLElement | null = document.querySelector('.uslugi-for-circles')
const buttonLeft: HTMLElement | null = document.querySelector('.arrow-left')
const buttonRight: HTMLElement | null = document.querySelector('.arrow-right')
const shift = 500
let scrollLeftVar = forSlider?.scrollLeft
let isAnimationEnd = true


forSlider?.addEventListener('scroll', scrollingX)
buttons()

function scrollingX() {
    scrollLeftVar = forSlider?.scrollLeft
    return scrollLeftVar
}

function buttons() {
    if (!forSlider) {
        return
    }

    forSlider?.addEventListener('animationend', () => {
        isAnimationEnd = true
        console.log(isAnimationEnd)
    })
    
    buttonRight?.addEventListener('click', () => {
        forSlider.scrollLeft += shift 
    })

    buttonLeft?.addEventListener('click', () => {
        forSlider.scrollLeft -= shift 
    })
}
