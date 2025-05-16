import React, {useRef, useState, useCallback} from 'react'
import {Document, Page, pdfjs} from 'react-pdf'
import {PdfDimensions, Position, componentProps} from './types'

// Установка worker пути для pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const StampInPDF: React.FC<componentProps> = ({
                                                  initialPosition = {x: 50, y: 50},
                                                  fileSrc,
                                                  changePosition,
                                                  globalStyle = {},
                                                  containerStyle = {},
                                                  stampStyle = {},
                                                  stampText = 'МЕСТО ШТАМПА',
                                                  documentLoadingText = 'Загрузка документа...',
                                                  pageLoadingText = 'Загрузка страницы...',
                                                  paginatorStyle = {},
                                                  pagePrevText = 'Предыдущая',
                                                  pageNextText = 'Следующая',
                                                  buttonPrevStyle = {},
                                                  buttonNextStyle = {},
                                                  paginatorDescriptionStyle = {}
                                              }) => {
    const [numPages, setNumPages] = useState<number | null>(null) // кол-во страниц в PDF
    const [pageNumber, setPageNumber] = useState<number>(1) // текущая страница
    const [stampPosition, setStampPosition] = useState<Position>(initialPosition as Position) // начальная позиция штампа
    const [dragOffset, setDragOffset] = useState<Position>({x: 0, y: 0})
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [pdfDimensions, setPdfDimensions] = useState<PdfDimensions>({width: 0, height: 0}) // размер PDF
    const containerRef = useRef<HTMLDivElement>(null!) // ref контейнера
    const stampRef = useRef<HTMLDivElement>(null!) // ref штампа

    // устанавливаем кол-во страниц после загрузки файла
    const onDocumentLoadSuccess = ({numPages}: { numPages: number }) => {
        setNumPages(numPages)
    }

    // устанавливаем размер страницы после загрузки страницы
    const onPageLoadSuccess = (page: { originalWidth: number; originalHeight: number }) => {
        setPdfDimensions({
            width: page.originalWidth,
            height: page.originalHeight
        })
    }

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!stampRef.current) return

        const stampRect = stampRef.current.getBoundingClientRect()
        setIsDragging(true)
        setDragOffset({
            x: e.clientX - stampRect.left,
            y: e.clientY - stampRect.top
        })
        e.preventDefault()
    }, [])

    // перемещаем штамп
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current || !stampRef.current) return

        const containerRect = containerRef.current.getBoundingClientRect()
        const stampRect = stampRef.current.getBoundingClientRect()

        // Рассчитываем новые координаты
        let x = e.clientX - containerRect.left - dragOffset.x
        let y = e.clientY - containerRect.top - dragOffset.y

        // Ограничиваем перемещение границами контейнера
        const maxX = containerRect.width - stampRect.width
        const maxY = containerRect.height - stampRect.height

        x = Math.max(0, Math.min(x, maxX))
        y = Math.max(0, Math.min(y, maxY))

        setStampPosition({x, y})
    }, [isDragging, dragOffset])

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false)
            changeStampPosition()
        }
    }

    // изменяем данные о странице и местоположении штампа
    const changeStampPosition = (): void => {
        // console.log(`Размер сраницы: ${pdfDimensions.width} x ${pdfDimensions.height}`)
        // console.log(`Номер сраницы: ${pageNumber}`)
        // console.log(`Координаты штампа: x: ${stampPosition.x}, y: ${stampPosition.y}`)
        // console.log(`Размер штампа: ${stampRef.current?.getBoundingClientRect().width} x ${stampRef.current?.getBoundingClientRect().height}`)
        changePosition({
            stampPositionX: stampPosition.x.toString(),
            stampPositionY: stampPosition.y.toString(),
            pageWidth: pdfDimensions.width.toString(),
            pageHeight: pdfDimensions.height.toString(),
            pageNumber,
            stampWidth: stampRef.current?.getBoundingClientRect().width.toString(),
            stampHeight: stampRef.current?.getBoundingClientRect().height.toString()
        })
    }

    // переход на пред. страницу
    const goToPrevPage = () =>
        setPageNumber(prev => Math.max(prev - 1, 1))

    // переход на след. страницу
    const goToNextPage = () =>
        setPageNumber(prev => (numPages ? Math.min(prev + 1, numPages) : prev))

    return (
        <div className="react-dnd-stamp-pdf-container" style={{...globalStyle}}>
            <div className="react-dnd-stamp-pdf-paginator"
                 style={{display: 'flex', justifyContent: 'center', margin: '10px 0', ...paginatorStyle}}
            >
                <button
                    className="react-dnd-stamp-pdf-paginator-button-prev"
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    style={{...buttonPrevStyle}}
                >
                    {pagePrevText}
                </button>
                <span
                    className="react-dnd-stamp-pdf-paginator-description"
                    style={{margin: '0 15px', ...paginatorDescriptionStyle}}
                >
                    Страница {pageNumber} из {numPages || '--'}
                </span>
                <button
                    className="react-dnd-stamp-pdf-paginator-button-next"
                    onClick={goToNextPage}
                    disabled={numPages ? pageNumber >= numPages : true}
                    style={{...buttonNextStyle}}
                >
                    {pageNextText}
                </button>
            </div>

            <div
                className="react-dnd-stamp-pdf-document-container"
                ref={containerRef}
                style={{
                    position: 'relative',
                    width: 'fit-content',
                    border: '1px solid #ccc',
                    margin: '0 auto',
                    ...containerStyle
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <Document
                    file={fileSrc}
                    onLoadSuccess={onDocumentLoadSuccess}
                    renderMode="canvas"
                    loading={documentLoadingText}
                >
                    <Page
                        pageNumber={pageNumber}
                        onLoadSuccess={onPageLoadSuccess}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        loading={pageLoadingText}
                    />
                </Document>

                {/* Перемещаемый штамп */}
                <div
                    className="react-dnd-stamp-pdf-stamp-container"
                    ref={stampRef}
                    style={{
                        position: 'absolute',
                        left: `${stampPosition.x}px`,
                        top: `${stampPosition.y}px`,
                        cursor: isDragging ? 'grabbing' : 'grab',
                        padding: '10px',
                        border: '2px solid #5858FF',
                        userSelect: 'none',
                        width: 215,
                        height: 65,
                        color: '#5858FF',
                        fontSize: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        ...stampStyle
                    }}
                    onMouseDown={handleMouseDown}
                    draggable="false"
                >
                    {stampText}
                </div>
            </div>
        </div>
    )
}

export default StampInPDF
