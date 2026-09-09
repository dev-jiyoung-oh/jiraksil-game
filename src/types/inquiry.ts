export interface InquiryRequest {
  title: string;
  content: string;
  authorName: string;
  isPrivate: boolean;
  password?: string;
}

export interface InquiryListItem {
  id: number;
  title: string;
  authorName: string;
  isPrivate: boolean;
  hasReply: boolean;
  createdAt: string;
}

export interface InquiryDetail extends InquiryListItem {
  content: string;
  reply?: string;
  repliedAt?: string;
}
