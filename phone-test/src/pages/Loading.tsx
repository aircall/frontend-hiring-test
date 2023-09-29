import {Icon, MotionBox, SettingsFilled, Spacer } from "@aircall/tractor"



export const Loading = ()=>{

      return <Spacer marginLeft='5vw' marginTop = '20vh' space={10} direction='horizontal'>
<MotionBox bg="primary.light" minWidth={100} animate={{
        x: 0,
        y: 0,
        scale: 1,
        rotate: 360,
        animationIterationCount: "infinite"
      }} transition={{
        duration: 2
      }} maxWidth={100} borderRadius={8} background='primary.base'><Icon component={SettingsFilled} size={32} /></MotionBox>

<MotionBox bg="primary.light" minWidth={100} animate={{
        x: 0,
        y: 0,
        scale: 1,
        animationIterationCount: "infinite",
        rotate: -360
      }} transition={{
        duration: 2
      }} maxWidth={100} borderRadius={8} background='primary.base'><Icon component={SettingsFilled} size={32} /></MotionBox>

<MotionBox bg="primary.light" minWidth={100} animate={{
        x: 0,
        y: 0,
        scale: 1,
        rotate: 360,
        animationIterationCount: "infinite"
      }} transition={{
        duration: 2
      }} maxWidth={100} borderRadius={8} background='primary.base'><Icon component={SettingsFilled} size={32} /></MotionBox>
      <MotionBox bg="primary.light" minWidth={100} animate={{
        x: 0,
        y: 0,
        scale: 1,
        rotate: -360,
        animationIterationCount: "infinite"
      }} transition={{
        duration: 2
      }} maxWidth={100} borderRadius={8} background='primary.base'><Icon component={SettingsFilled} size={32} /></MotionBox>
      </Spacer>
      }