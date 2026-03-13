import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import {
  UserProfileInformationDto,
  UserResponseDto,
} from '../dtos/user/user.dto';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { TbUserProfile } from '../entities/user/user_profile.entity';
import { ChatRepository } from './chat.repository';
import { TbConversation } from '../entities/chat/converation.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(TbUserDefault)
    private readonly userDefault: Repository<TbUserDefault>,

    @InjectRepository(TbUserProfile)
    private readonly userProfile: Repository<TbUserProfile>,

    @InjectRepository(TbConversation)
    private readonly conversationRepository: Repository<TbConversation>,

    private readonly chatRepo: ChatRepository,
  ) {}

  public async UpdateUserProfile(
    userCode: string,
    payload: UserProfileInformationDto,
  ): Promise<UserResponseDto> {
    const userData = await this.userDefault.findOneBy({
      userCode: userCode,
    });

    const mergeData = this.userDefault.merge(userData as TbUserDefault, {
      username: payload.userName || userData?.username,
      fullName: payload.fullName || userData?.fullName,
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
      avatarUrl: payload.avatarUrl || userProfileData?.avatarUrl,
      coverUrl: payload.coverUrl || userProfileData?.coverUrl,
      bio: payload.bio || userProfileData?.bio,
      phone: payload.phone || userProfileData?.phone,
      fullAddress: payload.fullAddress || userProfileData?.fullAddress,
      userWard: payload.userWard || userProfileData?.userWard,
      userDistrict: payload.userDistrict || userProfileData?.userDistrict,
      userCity: payload.userCity || userProfileData?.userCity,
      userProvince: payload.userProvince || userProfileData?.userProvince,
      userCountry: payload.userCountry || userProfileData?.userCountry,
      userPortal: payload.userPortal || userProfileData?.userPortal,
      userLat: payload.userLat || userProfileData?.userLat,
      userLong: payload.userLong || userProfileData?.userLong,
      userDescription:
        payload.userDescription || userProfileData?.userDescription,
      userNote: payload.userNote || userProfileData?.userNote,
      dateOfBirth: payload.dateOfBirth || userProfileData?.dateOfBirth,
    });

    if (userMergeData.avatarUrl) {
      const conversations = await this.chatRepo.getConversations(updatedData.id);

      if (conversations?.length) {
        conversations.forEach((c) => {
          c.avatar = userMergeData.avatarUrl;
        });

        await this.conversationRepository.save(conversations);
      }
    }

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
      .leftJoin('tb_user_profile', 'TUP', 'TUD.id = TUP.user_id')
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

  public async getUserProfileByUserId(
    userId: number,
  ): Promise<UserResponseDto> {
    const user = await this.userDefault
      .createQueryBuilder('TUD')
      .leftJoin('tb_user_profile', 'TUP', 'TUD.id = TUP.user_id')
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
      .where('TUD.id = :userId', { userId })
      .getRawOne<UserResponseDto>();

    return user as UserResponseDto;
  }

  public async getUserProfilesByUserIds(
    userIds: number[],
  ): Promise<UserResponseDto[]> {
    console.log('userIds', userIds);
    if (userIds.length === 0) return [];

    return await this.userDefault
      .createQueryBuilder('TUD')
      .leftJoin('tb_user_profile', 'TUP', 'TUD.id = TUP.user_id')
      .select([
        'TUD.id AS id',
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
      .where('TUD.id IN (:...userIds)', { userIds })
      .getRawMany<UserResponseDto>();
  }
}
