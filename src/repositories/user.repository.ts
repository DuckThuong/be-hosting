import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { Repository } from 'typeorm';
import { TbUserProfile } from '../entities/user/user_profile.entity';
import {
  UpdateUserProfileInformationPayload,
  UserResponseDto,
} from '../dtos/user/user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(TbUserDefault)
    private readonly userDefault: Repository<TbUserDefault>,

    @InjectRepository(TbUserProfile)
    private readonly userProfile: Repository<TbUserProfile>,
  ) {}

  public async UpdateUserProfile(
    payload: UpdateUserProfileInformationPayload,
  ): Promise<UserResponseDto> {
    const userData = await this.userDefault.findOneBy({
      userCode: payload.userCode,
    });

    const mergeData = this.userDefault.merge(userData as TbUserDefault, {
      username: payload.data?.userName || userData?.username,
      fullName: payload.data?.fullName || userData?.fullName,
    });

    const updatedData = await this.userDefault.save(mergeData);

    const userProfileData = await this.userProfile.findOneBy({
      user_id: updatedData.id,
    });

    const userMergeData = this.userProfile.merge(
      userProfileData as TbUserProfile,
      {
        avatarUrl: payload.data?.avartar || userProfileData?.avatarUrl,
        coverUrl: payload.data?.coverUrl || userProfileData?.coverUrl,
        bio: payload.data?.bio || userProfileData?.bio,
        phone: payload.data?.phone || userProfileData?.phone,
        fullAddress: payload.data?.fullAddress || userProfileData?.fullAddress,
        userWard: payload.data?.userWard || userProfileData?.userWard,
        userDistrict:
          payload.data?.userDistrict || userProfileData?.userDistrict,
        userCity: payload.data?.userCity || userProfileData?.userCity,
        userProvince:
          payload.data?.userProvince || userProfileData?.userProvince,
        userCountry: payload.data?.userCountry || userProfileData?.userCountry,
        userPortal: payload.data?.userPortal || userProfileData?.userPortal,
        userLat: payload.data?.userLat || userProfileData?.userLat,
        userLong: payload.data?.userLong || userProfileData?.userLong,
        userDescription:
          payload.data?.userDescription || userProfileData?.userDescription,
        userNote: payload.data?.userNote || userProfileData?.userNote,
        dateOfBirth: payload.data?.dateOfBirth || userProfileData?.dateOfBirth,
      },
    );

    const updatedProfileData = await this.userProfile.save(userMergeData);

    const rawData = {
      ...updatedData,
      ...updatedProfileData,
    };
    return plainToInstance(UserResponseDto, rawData);
  }

  public async GetUserInfomation(userCode: string): Promise<UserResponseDto> {
    const user = await this.userDefault
      .createQueryBuilder('TUD')
      .leftJoin('tb_user_profile', 'TUP', 'TUD.ID = TUP.USER_ID')
      .select([
        'TUD.userCode AS userCode',
        'TUD.username AS username',
        'TUD.email AS email',
        'TUD.fullName AS fullName',
        'TUD.role AS role',
        'TUD.isEmailVerified AS isEmailVerified',

        'TUP.dateOfBirth AS dateOfBirth',
        'TUP.avatarUrl AS avatarUrl',
        'TUP.coverUrl AS coverUrl',
        'TUP.BIO AS bio',
        'TUP.PHONE AS phone',
        'TUP.fullAddress AS fullAddress',
        'TUP.userWard AS userWard',
        'TUP.userDistrict AS userDistrict',
        'TUP.userCity AS userCity',
        'TUP.userProvince AS userProvince',
        'TUP.userCountry AS userCountry',
        'TUP.userPortal AS userPortal',
        'TUP.userLat AS userLat',
        'TUP.userLONG AS userLong',
        'TUP.userDescription AS userDescription',
        'TUP.userNote AS userNote',
      ])
      .where('TUD.userCode = :userCode', { userCode })
      .getRawOne<UserResponseDto>();

    return user as UserResponseDto;
  }
}
