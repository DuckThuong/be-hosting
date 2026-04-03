export interface CommentUser {
  code: string;
  name: string;
  avatar: string;
}

export interface FormattedReply {
  id: number;
  content: string;
  rate: number;
  type: 'REPLY';
  createdAt: Date;
  user: CommentUser;
}

export interface FormattedComment {
  id: number;
  content: string;
  rate: number;
  type: 'REVIEW';
  createdAt: Date;
  user: CommentUser;
  replies: FormattedReply[];
  totalReplies: number;
}

export class RawCommentDto {
  id: number;
  content: string;
  rate: number;
  createdAt: Date;
  userCode: string;
  userName: string;
  userAvatar: string;
}

export class RawCommentReplyDto {
  id: number;
  preCommentId: number;
  content: string;
  rate: number;
  createdAt: Date;
  userCode: string;
  userName: string;
  userAvatar: string;
}

export function formatReply(raw: RawCommentReplyDto): FormattedReply {
  return {
    id: raw.id,
    content: raw.content,
    rate: raw.rate,
    type: 'REPLY',
    createdAt: raw.createdAt,
    user: {
      code: raw.userCode,
      name: raw.userName ?? 'Unknown',
      avatar: raw.userAvatar ?? `https://i.pravatar.cc/150?u=${raw.userCode}`,
    },
  };
}

export function formatComment(
  raw: RawCommentDto,
  replies: FormattedReply[],
): FormattedComment {
  return {
    id: raw.id,
    content: raw.content,
    rate: raw.rate,
    type: 'REVIEW',
    createdAt: raw.createdAt,
    user: {
      code: raw.userCode,
      name: raw.userName ?? 'Unknown',
      avatar: raw.userAvatar ?? `https://i.pravatar.cc/150?u=${raw.userCode}`,
    },
    replies,
    totalReplies: replies.length,
  };
}
