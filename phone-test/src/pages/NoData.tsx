import { Box, Typography } from "@aircall/tractor"



export const NoData = ()=>{

      return <Box minWidth="400px" minHeight='100px' display={"flex"} justifySelf={"center"} p={4} boxShadow={2} bg="#006B51"  marginTop='20vh' borderRadius='10px'>
      <Typography textAlign="center" variant="displayM" marginTop='10px' alignSelf={"center"}>
        No Data to be displayed.
      </Typography>
    </Box>
      }