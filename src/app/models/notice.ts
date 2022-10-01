export class Notice{
  count: number;
  page: number;
  totalPages: number;
  nextPage: number;
  previousPage: number;
  showingFrom: number;
  showingTo: number;
  items: Item[];
}
export class Item{
  id: number;
  tipo: string;
  titulo: string;
  introducao: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  data_publicacao: Date;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  produto_id: number;
  produtos: string;
  editorias: string;
  imagens: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  produtos_relacionados: string;
  destaque: boolean;
  link: string;
  photos: Photos;
  save = false;
}
export class Photos{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  image_fulltext: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  image_intro: string;
}
