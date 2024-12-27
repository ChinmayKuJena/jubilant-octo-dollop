import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/users.entity';
import { EmailOtpService } from 'src/email-otp/email-otp.service';
import { JwtUtil } from 'src/utils/jwt.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private emailService: EmailOtpService,
    // private jwtUtil: JwtUtil,
  ) {}

  // Login with username and number, validate them, then send email
  async login(username: string, number: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username, phone_number: number },
    });
    if (!user) {
      throw new NotFoundException(
        'User not found with the provided credentials.',
      );
    }
    const claim = { id: user.id, username: user.username, email: user.email };
    const token = JwtUtil.generateToken(claim, '1h');
    // Respond to the client immediately after validation
    const response = {
      message: 'OTP sent to your registered email address.',
      claim: claim,
      token: token,
    };

    // Perform save and email operations asynchronously
    (async () => {
      try {
        // Update last login time
        user.last_login = new Date();
        await this.userRepository.save(user);

        // Generate and send OTP email
        await this.emailService.generateAndSendOtp(user.email);
      } catch (error) {
        console.error('Error during login post-processing:', error);
      }
    })();

    return response;
  }
}
