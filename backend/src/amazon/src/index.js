const { Auth } = require('aws-amplify')

async function signUp(phoneNumber) {
  try {
    const user = await Auth.signUp({
      phone_number: phoneNumber
    });
    console.log({ user });
  } catch (error) {
    console.log('error signing up:', error);
  }
}



( async () => {
  await signUp('918080864421')
}  )()
