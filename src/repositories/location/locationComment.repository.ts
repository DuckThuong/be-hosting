import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { COMMENT_TYPE } from '../../assests/constants/constants';
import { SuccessLocationMessage } from '../../assests/messages/location.message';
import {
  formatComment,
  formatReply,
  FormattedComment,
  RawCommentDto,
  RawCommentReplyDto,
} from '../../common/formator/comment.format';
import {
  TbLocationComment,
  TbLocationCommentReply,
} from '../../entities/location/locationComment.entity';
import {
  GetAllCommentDto,
  GetAllCommentResponseDto,
  LocationCommentPayloadDto,
} from '../../dtos/location/locationComment.dto';

@Injectable()
export class LocationCommentRepository {
  constructor(
    @InjectRepository(TbLocationComment)
    private readonly comment: Repository<TbLocationComment>,

    @InjectRepository(TbLocationCommentReply)
    private readonly reply: Repository<TbLocationCommentReply>,
  ) {}

  public async createComment(
    userCode: string,
    payload: LocationCommentPayloadDto,
  ): Promise<any> {
    if (payload.type === COMMENT_TYPE.COMMENT) {
      await this.createNewComment(userCode, payload);

      return {
        message: SuccessLocationMessage.CREATE_SUCCESS,
      };
    } else if (payload.type === COMMENT_TYPE.REPLY) {
      await this.createNewReply(userCode, payload);
      return {
        message: SuccessLocationMessage.CREATE_SUCCESS,
      };
    }
  }

  public async getAllComment(
    payload: GetAllCommentDto,
  ): Promise<GetAllCommentResponseDto> {
    const { locationCode, page = 1, limit = 10 } = payload;
    const skip = (page - 1) * limit;

    const [comments, total]: [RawCommentDto[], number] = await Promise.all([
      this.comment
        .createQueryBuilder('comment')
        .leftJoin('tb_user', 'user', 'user.userCode = comment.userCode')
        .select([
          'comment.id           AS id',
          'comment.content      AS content',
          'comment.rate         AS rate',
          'comment.createdAt    AS createdAt',
          'comment.userCode     AS userCode',
          'user.fullName        AS userName',
          'user.avatar          AS userAvatar',
        ])
        .where('comment.locationCode = :locationCode', { locationCode })
        .orderBy('comment.createdAt', 'DESC')
        .offset(skip)
        .limit(limit)
        .getRawMany<RawCommentDto>(),

      this.comment
        .createQueryBuilder('comment')
        .where('comment.locationCode = :locationCode', { locationCode })
        .getCount(),
    ]);

    if (!comments.length) {
      return {
        data: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };
    }

    const commentIds = comments.map((c) => c.id);

    const replies: RawCommentReplyDto[] = await this.reply
      .createQueryBuilder('reply')
      .leftJoin('tb_user', 'user', 'user.userCode = reply.userCode')
      .select([
        'reply.id            AS id',
        'reply.preCommentId  AS preCommentId',
        'reply.content       AS content',
        'reply.rate          AS rate',
        'reply.createdAt     AS createdAt',
        'reply.userCode      AS userCode',
        'user.fullName       AS userName',
        'user.avatar         AS userAvatar',
      ])
      .where('reply.preCommentId IN (:...ids)', { ids: commentIds })
      .orderBy('reply.createdAt', 'ASC')
      .getRawMany<RawCommentReplyDto>();

    const repliesMap = replies.reduce<
      Record<number, ReturnType<typeof formatReply>[]>
    >((acc, reply) => {
      const key = reply.preCommentId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(formatReply(reply));
      return acc;
    }, {});

    const data: FormattedComment[] = comments.map((comment) =>
      formatComment(comment, repliesMap[comment.id] ?? []),
    );

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async createNewComment(
    userCode: string,
    payload: LocationCommentPayloadDto,
  ): Promise<TbLocationComment> {
    const newComment = this.comment.create({
      locationCode: payload.locationCode,
      userCode: userCode,
      rate: payload.content.ratevalue,
      content: payload.content.content,
      metaData: JSON.stringify(payload.content.metaData),
      createdAt: new Date(),
    });

    return await this.comment.save(newComment);
  }

  private async createNewReply(
    userCode: string,
    payload: LocationCommentPayloadDto,
  ): Promise<TbLocationCommentReply> {
    const newReply = this.reply.create({
      preCommentId: payload.commentId,
      userCode: userCode,
      rate: payload.content.ratevalue,
      content: payload.content.content,
      metaData: JSON.stringify(payload.content.metaData),
      createdAt: new Date(),
    });

    return await this.reply.save(newReply);
  }
}
