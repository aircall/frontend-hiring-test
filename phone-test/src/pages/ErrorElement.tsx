import { Box, Spacer, Typography } from "@aircall/tractor"
import { Link } from "react-router-dom"



export const ErrorElement = ()=>{

      return <Box minWidth="400px" minHeight='100px' my="100" p={4} boxShadow={2} bg="#101820" display={'flex'} justifySelf={"center"} borderRadius='10px'>
        <Spacer space={4} direction='vertical'>
      <Typography textAlign="center" variant="displayXL" marginTop='10px' alignSelf={"center"} color='#BB2100'>
        OOPS!!!
      </Typography>
      <Typography textAlign={"left"} variant="displayS">
        Looks like we have run into some Trouble.
      </Typography>
      <Typography textAlign={"left"} variant="body2">
        Here are some helpful links instead:
      </Typography>
      <Box>
      <Spacer space={2} direction='vertical'>
      <Link to='/login' color="#307FE2">Login</Link>
      <Link to='/calls' color="#307FE2">Calls List</Link>
      </Spacer>
      </Box>
      </Spacer>
    </Box>
      }