# react-dnd-stamp-pdf

Библиотека дает возможность выбрать место для штампа в документе PDF

## Installation

```bash
npm i react-dnd-stamp-pdf
```

## Usage

```bash
import React from 'react';
import StampInPDF from 'react-dnd-stamp-pdf';

const App = () => {
  
  const changePosition = (data: stampPositionInfo) => {
        //.....
    }

  return (
    <StampInPDF
        fileSrc="https://example.com/example.pdf"
        changePosition={changePosition}
        initialPosition={{x:50, y:50}}
    />
  );
};

export default App;
```

## Props

```bash
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
```

## Types

```bash
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
```

## License

MIT

