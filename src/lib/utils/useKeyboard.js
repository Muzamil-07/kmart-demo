import { useMemo, useEffect } from 'react'

export function useKeyboard () {
  const keyboard = useMemo(() => ({}), [])

  let previousTouchX
  let previousTouchY

  const keydown = e => (keyboard[e.key] = true)
  const keyup = e => (keyboard[e.key] = false)

  // function handleTouchMove (event) {
  //   const currentTouchX = event.touches[0].clientX
  //   const currentTouchY = event.touches[0].clientY

  //   if (previousTouchX !== undefined && previousTouchY !== undefined) {
  //     const deltaX = currentTouchX - previousTouchX
  //     const deltaY = currentTouchY - previousTouchY

  //     // Set a threshold value for direction change
  //     const directionChangeThreshold = 5 // Adjust this value according to your preference

  //     if (
  //       Math.abs(deltaX) > directionChangeThreshold ||
  //       Math.abs(deltaY) > directionChangeThreshold
  //     ) {
  //       // Determine the dominant direction
  //       if (Math.abs(deltaX) > Math.abs(deltaY)) {
  //         // Horizontal movement
  //         keyboard['ArrowRight'] = deltaX > 0
  //         keyboard['ArrowLeft'] = deltaX < 0
  //         keyboard['ArrowUp'] = false
  //         keyboard['ArrowDown'] = false
  //       } else {
  //         // Vertical movement
  //         keyboard['ArrowUp'] = deltaY < 0
  //         keyboard['ArrowDown'] = deltaY > 0
  //         keyboard['ArrowLeft'] = false
  //         keyboard['ArrowRight'] = false
  //       }
  //     }
  //   }

  //   // Update previous touch positions
  //   previousTouchX = currentTouchX
  //   previousTouchY = currentTouchY
  // }
  function handleTouchMove (event) {
    const currentTouchX = event.touches[0].clientX
    const currentTouchY = event.touches[0].clientY

    if (
      previousTouchX !== undefined &&
      previousTouchY !== undefined &&
      event.target.tagName === 'CANVAS'
    ) {
      const deltaX = currentTouchX - previousTouchX
      const deltaY = currentTouchY - previousTouchY

      // Set a threshold value for direction change
      const directionChangeThreshold = 5 // Adjust this value according to your preference

      // DRAG CONTROL
      // if (
      //   Math.abs(deltaX) < directionChangeThreshold &&
      //   Math.abs(deltaY) >= directionChangeThreshold
      // ) {
      //   // Vertical movement
      //   keyboard['ArrowUp'] = deltaY < 0
      //   keyboard['ArrowDown'] = deltaY > 0
      //   keyboard['ArrowLeft'] = false
      //   keyboard['ArrowRight'] = false
      // } else {
      //   // No movement
      //   keyboard['ArrowUp'] = false
      //   keyboard['ArrowDown'] = false
      //   keyboard['ArrowLeft'] = false
      //   keyboard['ArrowRight'] = false
      // }

      // CONTINOUS CONTROL
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        //         // Horizontal movement
        keyboard['ArrowUp'] = deltaY < 0
        keyboard['ArrowDown'] = deltaY > 0
        keyboard['ArrowLeft'] = false
        keyboard['ArrowRight'] = false
      }
    }

    // Update previous touch positions
    previousTouchX = currentTouchX
    previousTouchY = currentTouchY
  }

  const touchEnd = () => {
    keyboard['ArrowUp'] = false
    keyboard['ArrowLeft'] = false
    keyboard['ArrowRight'] = false
    keyboard['ArrowDown'] = false
  }

  useEffect(() => {
    document.addEventListener('keydown', keydown)
    document.addEventListener('keyup', keyup)

    const joystickBaseElement = document.querySelector(
      '[data-testid="joystick-base"]'
    )
    // if (joystickBaseElement) {
    //   joystickBaseElement.addEventListener('touchmove', handleTouchMove)
    //   joystickBaseElement.addEventListener('touchend', touchEnd)
    // }
    const storeCanvas = document.getElementById('storeCanvas')

    storeCanvas.addEventListener('touchmove', handleTouchMove)
    storeCanvas.addEventListener('touchend', touchEnd)
    return () => {
      document.removeEventListener('keydown', keydown)
      document.removeEventListener('keyup', keyup)

      // if (joystickBaseElement) {
      //   joystickBaseElement.removeEventListener('touchmove', handleTouchMove)
      //   joystickBaseElement.removeEventListener('touchend', touchEnd)
      // }
      storeCanvas.removeEventListener('touchmove', handleTouchMove)
      storeCanvas.removeEventListener('touchend', touchEnd)
    }
  }, [keyboard])

  return keyboard
}
