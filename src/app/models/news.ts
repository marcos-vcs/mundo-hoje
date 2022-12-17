/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class News {
  count: number;
  page: number;
  totalPages: number;
  nextPage: number;
  previousPage: number;
  showingFrom: number;
  showingTo: number;
  items: Item[];
}
export class Item {
  id: number;
  tipo: string;
  titulo: string;
  introducao: string;
  data_publicacao: Date;
  produto_id: number;
  produtos: string;
  editorias: string;
  imagens: string;
  produtos_relacionados: string;
  destaque: boolean;
  link: string;
  photos: Photos;
  article: Article;
  save = false;
}
export class Photos {
  image_fulltext: string;
  image_intro: string;
}
export class Article {
  title: string;
  subtitle: string;
  metadata: string;
  text: string;
  textIndented: string[];
}
