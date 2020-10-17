const User = require('../../models/user');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');


module.exports = {
    createUser: async args =>{

        try{
            const existingUser = await User.findOne({email:args.userInput.email})
            if(existingUser){
                throw new Error('User exist already')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email:args.userInput.email,
                password:hashedPassword
            });
            const result = await user.save();
            // we set the password to null because we dont want the user to retrive it 
            return {...result._doc,password:null ,_id:result.id}
        } catch(err){
            console.log(err)
        }
        
    },
    login: async({email,password}) =>{
        const user = await User.findOne({email: email});
        console.log(email)
        if(!user){
            throw new Error('User does not exist')
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error('Password is incorrect')
        }

        const token = jwt.sign({userId: user.id, email: user.email},'thisisthekeyl4zy',{
            expiresIn: '1h'
        })
        // we return what we declared in the auth data type
        return {userId:user.id, token:token, tokenExpiration: 1};
    }
   
}