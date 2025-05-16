export interface Position {
    x: number;
    y: number;
}

export interface PdfDimensions {
    width: number;
    height: number;
}

export interface stampPositionInfo {
    pageWidth: string // ширина страницы
    pageHeight: string // высота страницы
    pageNumber: number // текущая страниа
    stampPositionX: string // координата штампа по оси x
    stampPositionY: string // координата штампа по оси y
    stampWidth: string // ширина штампа
    stampHeight: string // высота штампа
}

export interface componentProps {
    fileSrc: string // ссылка на PDF документ
    changePosition: (data: stampPositionInfo) => void // коллбек изменения положения штампа
    initialPosition?: Position // начальная позиция штампа
    pagePrevText?: string // текст на кнопке пред. стр. пагинатора
    pageNextText?: string // текст на кнопке след. стр. пагинатора
    documentLoadingText?: string // текст при загрузке документа
    pageLoadingText?: string // текст при загрузке страницы
    stampText?: string // текст в штампе
    globalStyle?: React.CSSProperties // стили глобального контейнера
    containerStyle?: React.CSSProperties // стили контейнера документа
    stampStyle?: React.CSSProperties // стили штампа
    paginatorStyle?: React.CSSProperties // стили пагинатора
    buttonPrevStyle?: React.CSSProperties // стили кнопки пред. стр. пагинатора
    buttonNextStyle?: React.CSSProperties // стили кнопки след. стр. пагинатора
    paginatorDescriptionStyle?: React.CSSProperties // стили описания пагинатора
}
