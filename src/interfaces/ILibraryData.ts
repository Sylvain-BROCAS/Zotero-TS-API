export interface ILink {
  href: string;
  type: string;
}

export interface ILinks {
  self?: ILink;
  alternate?: ILink;
}

export interface ILibraryData {
  id: number;
  name: string;
  type: 'users' | 'groups';
  links: ILinks;
}