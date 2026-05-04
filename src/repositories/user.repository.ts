import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';
import {
  UserProfileInformationDto,
  UserResponseDto,
} from '../dtos/user/user.dto';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { TbUserProfile } from '../entities/user/user_profile.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(TbUserDefault)
    private readonly userDefault: Repository<TbUserDefault>,

    @InjectRepository(TbUserProfile)
    private readonly userProfile: Repository<TbUserProfile>,
  ) {}

  private toUserResponseDto(
    user: TbUserDefault,
    profile?: TbUserProfile | null,
  ): UserResponseDto {
    return plainToInstance(UserResponseDto, {
      id: user.id,
      userCode: user.userCode,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      dateOfBirth: profile?.dateOfBirth,
      avatarUrl: profile?.avatarUrl,
      coverUrl: profile?.coverUrl,
      bio: profile?.bio,
      phone: profile?.phone,
      fullAddress: profile?.fullAddress,
      userWard: profile?.userWard,
      userDistrict: profile?.userDistrict,
      userCity: profile?.userCity,
      userProvince: profile?.userProvince,
      userCountry: profile?.userCountry,
      userPortal: profile?.userPortal,
      userLat: profile?.userLat,
      userLong: profile?.userLong,
      userDescription: profile?.userDescription,
      userNote: profile?.userNote,
    });
  }

  public async UpdateUserProfile(
    userCode: string,
    payload: UserProfileInformationDto,
  ): Promise<UserResponseDto> {
    const userData = await this.userDefault.findOneBy({
      userCode: userCode,
    });

    const mergeData = this.userDefault.merge(userData as TbUserDefault, {
      username: payload.userName ?? userData?.username,
      fullName: payload.fullName ?? userData?.fullName,
    });

    const updatedData = await this.userDefault.save(mergeData);

    let userProfileData = await this.userProfile.findOneBy({
      user_id: updatedData.id,
    });

    if (!userProfileData) {
      userProfileData = this.userProfile.create({
        user_id: updatedData.id,
      });
    }

    const userMergeData = this.userProfile.merge(userProfileData, {
      avatarUrl: payload.avatarUrl ?? userProfileData?.avatarUrl,
      coverUrl: payload.coverUrl ?? userProfileData?.coverUrl,
      bio: payload.bio ?? userProfileData?.bio,
      phone: payload.phone ?? userProfileData?.phone,
      fullAddress: payload.fullAddress ?? userProfileData?.fullAddress,
      userWard: payload.userWard ?? userProfileData?.userWard,
      userDistrict: payload.userDistrict ?? userProfileData?.userDistrict,
      userCity: payload.userCity ?? userProfileData?.userCity,
      userProvince: payload.userProvince ?? userProfileData?.userProvince,
      userCountry: payload.userCountry ?? userProfileData?.userCountry,
      userPortal: payload.userPortal ?? userProfileData?.userPortal,
      userLat: payload.userLat ?? userProfileData?.userLat,
      userLong: payload.userLong ?? userProfileData?.userLong,
      userDescription:
        payload.userDescription ?? userProfileData?.userDescription,
      userNote: payload.userNote ?? userProfileData?.userNote,
      dateOfBirth: payload.dateOfBirth ?? userProfileData?.dateOfBirth,
    });

    const updatedProfileData = await this.userProfile.save(userMergeData);

    return this.toUserResponseDto(updatedData, updatedProfileData);
  }

  public async GetUserInfomation(userCode: string): Promise<UserResponseDto> {
    const user = await this.userDefault.findOne({
      where: { userCode },
      relations: ['profile'],
    });

    if (!user) {
      return {} as UserResponseDto;
    }

    return this.toUserResponseDto(user, user.profile);
  }

  public async getUserProfileByUserId(
    userId: number,
  ): Promise<UserResponseDto> {
    const user = await this.userDefault.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      return {} as UserResponseDto;
    }

    return this.toUserResponseDto(user, user.profile);
  }

  public async getUserProfilesByUserIds(
    userIds: number[],
  ): Promise<UserResponseDto[]> {
    if (userIds.length === 0) return [];

    const users = await this.userDefault.find({
      where: { id: In(userIds) },
      relations: ['profile'],
    });

    return users.map((user) => this.toUserResponseDto(user, user.profile));
  }
  public async UpdateProfileAvatar(userCode: string, avatarUrl: string): Promise<UserResponseDto> {
    const user = await this.userDefault.findOneBy({ userCode });
    if (!user) {
      throw new Error('User not found');
    }
    const userProfile = await this.userProfile.findOneBy({ user_id: user.id });
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    const updatedUserProfile = this.userProfile.merge(userProfile, { avatarUrl });
    const updatedUserProfileData = await this.userProfile.save(updatedUserProfile);
    return this.toUserResponseDto(user, updatedUserProfileData);
  }
  public async UpdateProfileCover(userCode: string, coverUrl: string): Promise<UserResponseDto> {
    const user = await this.userDefault.findOneBy({ userCode });
    if (!user) {
      throw new Error('User not found');
    }
    const userProfile = await this.userProfile.findOneBy({ user_id: user.id });
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    const updatedUserProfile = this.userProfile.merge(userProfile, { coverUrl });
    const updatedUserProfileData = await this.userProfile.save(updatedUserProfile);
    return this.toUserResponseDto(user, updatedUserProfileData);
  }
}
