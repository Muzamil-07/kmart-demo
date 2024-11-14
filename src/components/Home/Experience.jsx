/* eslint-disable react/no-unknown-property */
'use client'
import { useKeyboard } from '@/lib/utils/useKeyboard'
import { useMouseCapture } from '@/lib/utils/useMouseCapture'
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Environment,
  Loader,
  Preload
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier' // Components for handling physics.
import { lazy, Suspense, useEffect, useState } from 'react'
import ReactHowler from 'react-howler'
import { Player } from './Player'

import { EffectComposer, Outline, Selection } from '@react-three/postprocessing'
// import Loader3d from "./Loader3d";
import Kmart from './Kmart'
function getInput (keyboard, mouse) {
  let [x, y, z] = [0, 0, 0]
  // Checking keyboard inputs to determine movement direction
  if (keyboard['ArrowDown']) z += 1.0 // Move backward
  if (keyboard['ArrowUp']) z -= 1.0 // Move forward
  if (keyboard['ArrowRight']) x += 6.0 // Move right
  if (keyboard['ArrowLeft']) x -= 6.0 // Move left
  if (keyboard[' ']) y += 1.0 // Jump

  // Returning an object with the movement and look direction
  return {
    move: [x, y, z],
    look: [mouse.x / window.innerWidth, mouse.y / window.innerHeight], // Mouse look direction
    running: keyboard['Shift'] // Boolean to determine if the player is running (Shift key pressed)
  }
}

const Scene = () => {
  const keyboard = useKeyboard() // Hook to get keyboard input
  const mouse = useMouseCapture() // Hook to get mouse input

  // useFollowCam(cameraSetups)

  const [shopVisibilityMap, setShopVisibilityMap] = useState({
    CosmeticsMarket: true,
    SportsMarket: true,
    GroceriesMarket: true,
    ElectronicMarket: true
  })

  const [isInteracting, setIsInteracting] = useState(false)

  return (
    <group>
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      {/* <Store scale={[10, 10, 10]} rotation-y={Math.PI} />        */}
      {/* <PlazaDraco scale={[10, 10, 10]} rotation-y={Math.PI} /> */}
      {/* <BasePlazaStructureKTX scale={[10, 10, 10]} rotation-y={Math.PI} /> */}
      {/* <BasePlazaStructure scale={[10, 10, 10]} rotation-y={Math.PI} /> */}
      <Selection>
        <EffectComposer autoClear={false}>
          <Outline
            visibleEdgeColor='#122830d6'
            hiddenEdgeColor='#122830d6'
            blur
            edgeStrength={20}
          />

          <Kmart />
        </EffectComposer>
      </Selection>

      <Environment
        // files={"metro_noord_2k.hdr"}
        // files={'palermo_square_2k.hdr'}
        files={'palermo_square_4k.hdr'}
        path='/'
        background={true}
        blur={0.2}
        environmentIntensity={1}
        backgroundIntensity={0.6}
        backgroundBlurriness={0}
      />

      <Player
        walk={5}
        jump={5}
        input={() => getInput(keyboard, mouse)}
        isInteracting={isInteracting}
      />
    </group>
  )
}

const Experience = () => {
  const [load, setLoad] = useState(true)

  useEffect(() => {
    let cursor = {
      delay: 8,
      _x: 0,
      _y: 0,
      endX: window.innerWidth / 2,
      endY: window.innerHeight / 2,
      cursorVisible: true,
      cursorEnlarged: false,
      $dot: document.querySelector('.cursor-dot'),
      $outline: document.querySelector('.cursor-dot-outline'),

      init: function () {
        // Set up element sizes
        this.dotSize = this.$dot.offsetWidth
        this.outlineSize = this.$outline.offsetWidth

        this.setupEventListeners()
        this.animateDotOutline()
      },

      setupEventListeners: function () {
        let self = this

        // Anchor hovering
        document.querySelectorAll('a').forEach(function (el) {
          el.addEventListener('mouseover', function () {
            self.cursorEnlarged = true
            self.toggleCursorSize()
          })
          el.addEventListener('mouseout', function () {
            self.cursorEnlarged = false
            self.toggleCursorSize()
          })
        })

        // Click events
        document.addEventListener('mousedown', function () {
          self.cursorEnlarged = true
          self.toggleCursorSize()
        })
        document.addEventListener('mouseup', function () {
          self.cursorEnlarged = false
          self.toggleCursorSize()
        })

        document.addEventListener('mousemove', function (e) {
          // Show the cursor
          self.cursorVisible = true
          self.toggleCursorVisibility()

          // Position the dot
          self.endX = e.pageX
          self.endY = e.pageY
          self.$dot.style.top = self.endY + 'px'
          self.$dot.style.left = self.endX + 'px'
        })

        // Hide/show cursor
        document.addEventListener('mouseenter', function (e) {
          self.cursorVisible = true
          self.toggleCursorVisibility()
          self.$dot.style.opacity = 1
          self.$outline.style.opacity = 1
        })

        document.addEventListener('mouseleave', function (e) {
          self.cursorVisible = true
          self.toggleCursorVisibility()
          self.$dot.style.opacity = 0
          self.$outline.style.opacity = 0
        })
      },

      animateDotOutline: function () {
        let self = this

        self._x += (self.endX - self._x) / self.delay
        self._y += (self.endY - self._y) / self.delay
        self.$outline.style.top = self._y + 'px'
        self.$outline.style.left = self._x + 'px'

        requestAnimationFrame(this.animateDotOutline.bind(self))
      },

      toggleCursorSize: function () {
        let self = this

        if (self.cursorEnlarged) {
          self.$dot.style.transform = 'translate(-50%, -50%) scale(0.75)'
          self.$outline.style.transform = 'translate(-50%, -50%) scale(1.5)'
        } else {
          self.$dot.style.transform = 'translate(-50%, -50%) scale(1)'
          self.$outline.style.transform = 'translate(-50%, -50%) scale(1)'
        }
      },

      toggleCursorVisibility: function () {
        let self = this

        if (self.cursorVisible) {
          self.$dot.style.opacity = 1
          self.$outline.style.opacity = 1
        } else {
          self.$dot.style.opacity = 0
          self.$outline.style.opacity = 0
        }
      }
    }

    cursor.init()
  }, [])

  return (
    <>
      {/* <Navbar bgLight /> */}
      <ReactHowler src='/song.mp3' playing={true} loop={true} />
      {/* <div class="cursor"></div> */}
      <div class='cursor-dot-outline'></div>
      <div class='cursor-dot'></div>

      <Canvas
        id='storeCanvas'
        style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed'
        }}
        camera={{
          fov: 35,
          position: [0, 0, 35]
        }}
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* <Perf position='top-left' /> */}
        <Suspense fallback={null}>
          <Physics>
            <Scene />
          </Physics>
          <Preload all />
        </Suspense>
      </Canvas>
      <Loader />
      {/* <Controls /> */}
    </>
  )
}

export default Experience
