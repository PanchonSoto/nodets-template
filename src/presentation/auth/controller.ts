import { Request, Response } from "express";
import { CustomError, RegisterUserDto, LoginUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";



export class AuthController {

    constructor(
     public readonly authService: AuthService
    ){}

    private handleError = (error: unknown, res: Response) => {
        if(error instanceof CustomError) {
            return res.status(error.statusCode).json({error: error.message});
        }
        console.log('handleError on Controller', error);
        return res.status(500).json({
            error: 'Internal server error',
            err: JSON.stringify(error)
        });
    }

    registerUser = (req:Request, res: Response)=> {
        const [error, registerDto] = RegisterUserDto.create(req.body);
        if(error) return res.status(400).json({error});

        this.authService.registerUser(registerDto!)
        .then((user)=> res.json({user}))
        .catch(err => this.handleError(err, res));
    }

    loginUser = (req:Request, res: Response)=> {
        const [error, loginDto] = LoginUserDto.create(req.body);
        if(error) return res.status(400).json({error});

        this.authService.loginUser(loginDto!)
        .then((user)=> res.json({user}))
        .catch(err => this.handleError(err, res));
    }

    // validateEmail = (req:Request, res: Response)=> {
    //     const { token } = req.params;

    //     this.authService.validateEmail(token)
    //     .then(()=>res.json('Email validated'))
    //     .catch(err => this.handleError(err, res));

    // }
}
