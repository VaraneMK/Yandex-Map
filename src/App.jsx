import React from 'react'
import styles from './App.module.css'
import {
	YMaps,
	Map,
	Placemark,
	Polyline,
	Polygon,
} from '@pbe/react-yandex-maps'
import {
	Radio,
	RadioGroup,
	Stack,
	Button,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
} from '@chakra-ui/react'

import { useToast } from '@chakra-ui/react'
import nextId from 'react-id-generator'
import TablePolygons from './widgets/TablePolygons/TablePolygons'
import TablePolylines from './widgets/TablePolylines/TablePolylines'
import TablePoints from './widgets/TablePoints/TablePoints'
import DataFrame from './widgets/DataFrame/DataFrame'

const defaultState = {
	center: [55.751574, 37.573856],
	zoom: 5,
	controls: ['fullscreenControl'],
}

function App() {
	const mapRef = React.useRef()

	const toast = useToast()
	const [type, setType] = React.useState(false)
	const [points, setPoints] = React.useState([])
	const [polylines, setPolylines] = React.useState([])
	const [polygons, setPolygons] = React.useState([])
	const [printMode, setPrintMode] = React.useState(false)

	const createObject = e => {
		if (printMode) {
			switch (type) {
				case 'Polyline':
					let polylineRef = polylines[polylines.length - 1].ref
					polylineRef.current?.editor.startDrawing()
					polylineRef.current?.editor.events.add('vertexadd', event => {})
					break
				case 'Polygon':
					let polygonRef = polygons[polygons.length - 1].ref
					polygonRef.current?.editor.startDrawing()
					polygonRef.current?.editor.events.add('vertexadd', event => {})
					break
				default:
					break
			}
		} else {
			if (type) {
				switch (type) {
					case 'Point':
						setPoints(prev => {
							const uid = nextId()
							const ref = React.createRef()

							return prev.concat([
								{
									ref: ref,
									object: (
										<Placemark
											instanceRef={ref}
											key={uid}
											properties={{
												iconContent: points.length + 1,
												uid: uid,
											}}
											options={{
												preset: 'islands#circleIcon',
												iconColor: '#fed7d7',
												// draggable: true,
											}}
											geometry={e.get('coords')}
										/>
									),
								},
							])
						})
						break
					case 'Polyline':
						setPolylines(prev => {
							const uid = nextId()
							const ref = React.createRef()
							return prev.concat([
								{
									ref: ref,
									object: (
										<Polyline
											instanceRef={ref}
											key={uid}
											geometry={[e.get('coords')]}
											properties={{
												uid: uid,
											}}
											options={{
												editorDrawingCursor: 'crosshair',
												strokeColor: '#e9d8fd',
												strokeWidth: 5,
												openEmptyBalloon: true,
											}}
										/>
									),
								},
							])
						})
						setPrintMode(true)
						break
					case 'Polygon':
						const uid = nextId()
						const ref = React.createRef()
						setPolygons(prev =>
							prev.concat([
								{
									ref: ref,
									object: (
										<Polygon
											key={uid}
											instanceRef={ref}
											geometry={[]}
											properties={{
												uid: uid,
											}}
											options={{
												editorDrawingCursor: 'crosshair',
												fillColor: '#c6f6d5',
												strokeColor: '#3081ce',
												strokeWidth: 5,
												fillOpacity: 1,
											}}
										/>
									),
								},
							])
						)
						setPrintMode(true)
						break
					default:
						break
				}
			} else {
				toast({
					title: 'Информация',
					description: 'Для размещения объекта выберите режим добавления',
					status: 'info',
					duration: 5000,
					isClosable: true,
				})
			}
		}
	}

	return (
		<div className={styles.app}>
			<div className={styles.tools}>
				<div className={styles.title}>Режимы добавления</div>

				<RadioGroup onChange={setType} value={type}>
					<Stack className={styles.tools__list} direction={'row'} gap={'20px'}>
						<Radio isDisabled={printMode} value={'Point'}>
							Точка
						</Radio>

						<Radio isDisabled={printMode} value={'Polyline'}>
							Линия
						</Radio>

						<Radio isDisabled={printMode} value={'Polygon'}>
							Полигон
						</Radio>
					</Stack>
				</RadioGroup>

				<Button
					isLoading={printMode}
					loadingText='Ожидание'
					colorScheme='red'
					variant='solid'
					className={styles.reset__btn}
					onClick={() => setType(false)}
				>
					Сбросить
				</Button>

				{printMode && (
					<Button
						isLoading={false}
						loadingText='Loading'
						colorScheme='red'
						variant='outline'
						spinnerPlacement='end'
						className={styles.reset__btn}
						onClick={() => {
							setPrintMode(false)
							polygons[polygons.length - 1]?.ref?.current?.editor.stopDrawing()
							polylines[
								polylines.length - 1
							]?.ref?.current?.editor.stopDrawing()
						}}
					>
						Завершить построение
					</Button>
				)}
			</div>
			<YMaps
				enterprise
				query={{
					apikey: 'ec5316ab-5c7b-4485-87d4-c84899a47cd5',
				}}
			>
				<Map
					instanceRef={mapRef}
					defaultState={defaultState}
					width={'60vw'}
					height={'100vh'}
					modules={[
						'control.ZoomControl',
						'control.FullscreenControl',
						'geoObject.addon.editor',
					]}
					onClick={e => {
						createObject(e)
					}}
				>
					{points.map(el => {
						return el.object
					})}
					{polylines.map(el => {
						return el.object
					})}
					{polygons.map(el => {
						return el.object
					})}
				</Map>
			</YMaps>
			<Tabs colorScheme='green'>
				<TabList
					width={'40vw'}
					display={'flex'}
					justifyContent={'space-between'}
				>
					<Tab width={'200px'}>Точки</Tab>
					<Tab width={'200px'}>Линии</Tab>
					<Tab width={'200px'}>Полигоны</Tab>
					<Tab width={'200px'}>Экспорт/импорт</Tab>
				</TabList>
				<TabPanels height={'95vh'} overflowY={'scroll'}>
					<TabPanel paddingLeft={0} paddingRight={0}>
						<TablePoints
							points={points}
							setPoints={setPoints}
							styles={styles}
						/>
					</TabPanel>

					<TabPanel paddingLeft={0} paddingRight={0}>
						<TablePolylines
							polylines={polylines}
							printMode={printMode}
							type={type}
							setPolylines={setPolylines}
							styles={styles}
						/>
					</TabPanel>

					<TabPanel paddingLeft={0} paddingRight={0}>
						<TablePolygons
							polygons={polygons}
							printMode={printMode}
							type={type}
							setPolygons={setPolygons}
							styles={styles}
						/>
					</TabPanel>

					<TabPanel paddingLeft={0} paddingRight={0}>
						<DataFrame
							points={points}
							setPoints={setPoints}
							polylines={polylines}
							setPolylines={setPolylines}
							polygons={polygons}
							setPolygons={setPolygons}
						/>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</div>
	)
}

export default App
