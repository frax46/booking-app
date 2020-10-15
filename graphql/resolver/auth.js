const User = require('../../models/user');

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
        
    }
   
}