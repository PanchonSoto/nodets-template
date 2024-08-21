import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain';
import prisma from '../../data/prisma/prisma-dbInstance';




export class AuthService {

    constructor(
        // private readonly emailSvc: EmailService
        //*no injection instead use a unique global instance of prisma
        // private readonly prisma = new PrismaClient(),
    ){}

    public async registerUser(registerUserDto: RegisterUserDto) {

        // const existUser = await UserModel.findOne({email: registerUserDto.email});

        try {
            const existUser = await prisma.user.findUnique({
                where: {
                    email: registerUserDto.email
                }
            });
            if(existUser) throw CustomError.badRequest('Email already exist');

            // const user = new UserModel(registerUserDto);
            const user = registerUserDto;

            //encript pass
            user.password = bcryptAdapter.hash(registerUserDto.password);

            const registeredUser = await prisma.user.create({
                data: registerUserDto
            });

            //jwt token
            const token = await JwtAdapter.generateToken({id: registeredUser.id, email: registeredUser.email});
            if(!token) throw CustomError.internalServer('Error while creating TOKEN');

            //confirmation email
            // await this.sendValidationEmail(user.email);

            // const { password, ...userEntity } = UserEntity.fromObject(user);

            return {
                registeredUser,
                token
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    public async loginUser(loginUserDto: LoginUserDto) {

        try {
            //findone to database
            const existUser = await prisma.user.findUnique({
                where: {
                    email: loginUserDto.email
                }
            });
            if(!existUser) throw CustomError.badRequest('User does not exist');

            //verify that password matched
            const match = bcryptAdapter.compare(loginUserDto.password, existUser.password);
            if(!match) throw CustomError.badRequest('Incorrect credentials');

            // const {password, ...userEntity} = UserEntity.fromObject(existUser);
            const { password, ...userWithoutPassword } = existUser;

            const token = await JwtAdapter.generateToken({id: existUser.id, email: existUser.email});
            if(!token) throw CustomError.internalServer('Error while creating TOKEN');



            return {
                user: userWithoutPassword,
                token
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    // private sendValidationEmail = async (email:string) => {
    //     const token = await JwtAdapter.generateToken({email});
    //     if(!token) throw CustomError.internalServer('Error gettin token');

    //     const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    //     const html = `
    //         <h1>Validate your email</h1>
    //         <p>Click on the following link to validate</p>
    //         <a href="${link}">Validate your email ${email}</a>
    //     `;
    //     const options = {
    //         to: email,
    //         subject: 'Email confirmation',
    //         htmlBody: html,
    //     }
    //     const isSet = await this.emailSvc.sendEmail(options);
    //     if(!isSet) throw CustomError.internalServer('Error sending email');

    //     return true;
    // }

    // public validateEmail = async(token:string) => {
    //     const payload = await JwtAdapter.validateToken(token);
    //     if(!payload) throw CustomError.unauthorized('Invalid token');

    //     const { email } = payload as { email:string };
    //     if(!email) throw CustomError.internalServer('Email not in token');

    //     const user = await UserModel.findOne({email});
    //     if(!user) throw CustomError.internalServer('Email not exists');

    //     user.emailValidated = true;
    //     await user.save();

    //     return true;
    // }
}
