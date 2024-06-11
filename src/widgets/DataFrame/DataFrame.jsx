import React, { useRef, useState } from 'react';
import styles from './DataFrame.module.css';
import { Button, Checkbox, CheckboxGroup, Heading, Stack, useToast } from '@chakra-ui/react';
import { Placemark, Polygon, Polyline } from '@pbe/react-yandex-maps';
import nextId from 'react-id-generator';

function DataFrame({ points, setPoints, polylines, setPolylines, polygons, setPolygons }) {
	const [checkedItems, setCheckedItems] = React.useState([false, false, false]);

	const [file, setFile] = useState(false);
	const [isReading, setIsReading] = useState(false);

	const inputRef = useRef();
	const toast = useToast();

	const handleUploadClick = () => {
		inputRef.current?.click();
	};

	const handleFileChange = (e) => {
		const files = e.target.files;
		if (!files) {
			return false;
		}
		console.log(files);
		if (files.length > 1) {
			toast({
				title: 'Ошибка',
				description: 'Вы не можете загрузить больше одного файла',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return false;
		}

		const file = files[0];
		if (file.type !== 'application/json' && !file.name.toLowerCase().endsWith('.geojson')) {
			toast({
				title: 'Ошибка',
				description: 'Вы можете загрузить только GeoJSON/JSON файл',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return false;
		}

		setFile(e.target.files[0]);
	};

	const readFile = () => {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.addEventListener('load', (event) => readGeoJson(event));
		reader.addEventListener('error', (event) => {
			console.error('[ParseJSON]:', event);
			toast({
				title: 'Ошибка',
				description: 'Произошла ошибка в чтении файла',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		});
	};

	const readGeoJson = (event) => {
		setIsReading(true);
		const errorIndexes = [];
		try {
			const geodata = JSON.parse(event.target.result);
			if (geodata.features == null || !Array.isArray(geodata.features)) {
				return window.alert('Некорректный формат GEOJSON (features)');
			}

			geodata.features
				.filter((feature, index) => {
					if (feature == null || typeof feature !== 'object') {
						errorIndexes.push(index);
						return false;
					}
					if (feature.id == null) {
						feature.id = index + 1;
					}
					if (typeof feature.id !== 'number' || typeof feature.type !== 'string') {
						errorIndexes.push(index);
						return false;
					}

					if (!['Point', 'LineString', 'Polygon', 'MultiPolygon'].includes(feature.geometry.type)) {
						errorIndexes.push(index);
						return false;
					}

					if (feature.geometry == null || typeof feature.geometry !== 'object') {
						errorIndexes.push(index);
						return false;
					}

					if (!Array.isArray(feature.geometry.coordinates)) {
						errorIndexes.push(index);
						return false;
					}

					return true;
				})
				.forEach((feature) => {
					switch (feature.geometry.type) {
						case 'Point': {
							const uid = nextId();
							const ref = React.createRef();
							setPoints((prev) => {
								return prev.concat([
									{
										ref: ref,
										object: (
											<Placemark
												instanceRef={ref}
												key={uid}
												properties={{
													iconContent: prev.length + 1,
													uid: uid,
												}}
												options={{
													preset: 'islands#circleIcon',
													iconColor: '#fed7d7',
													openEmptyBalloon: true,
													draggable: true,
												}}
												geometry={[
													feature.geometry.coordinates[1],
													feature.geometry.coordinates[0],
												]}
											/>
										),
									},
								]);
							});

							break;
						}
						case 'LineString': {
							const ref = React.createRef();
							const uid = nextId();
							setPolylines((prev) => {
								return prev.concat([
									{
										ref: ref,
										object: (
											<Polyline
												instanceRef={ref}
												key={uid}
												geometry={feature.geometry.coordinates.map((item) => [
													item[1],
													item[0],
												])}
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
								]);
							});
							setTimeout(() => {
								ref.current?.editor.startEditing();
								ref.current?.editor.events.add('vertexadd', (event) => {});
							}, 200);
							break;
						}
						case 'Polygon': {
							const ref = React.createRef();
							const uid = nextId();
							setPolygons((prev) =>
								prev.concat([
									{
										ref: ref,
										object: (
											<Polygon
												key={uid}
												instanceRef={ref}
												geometry={feature.geometry.coordinates.map((item) =>
													item.map((coords) => [coords[1], coords[0]]),
												)}
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
								]),
							);
							setTimeout(() => {
								ref.current?.editor.startEditing();
								ref.current?.editor.events.add('vertexadd', (event) => {});
							}, 200);
							break;
						}
						case 'MultiPolygon': {
							feature.geometry.coordinates.forEach((polygon) => {
								const ref = React.createRef();
								const uid = nextId();
								setPolygons((prev) =>
									prev.concat([
										{
											ref: ref,
											object: (
												<Polygon
													key={uid}
													instanceRef={ref}
													geometry={polygon.map((item) =>
														item.map((coords) => [coords[1], coords[0]]),
													)}
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
									]),
								);
								setTimeout(() => {
									ref.current?.editor.startEditing();
									ref.current?.editor.events.add('vertexadd', (event) => {});
								}, 200);
							});
							break;
						}
						default:
							break;
					}
				});

			setIsReading(false);
		} catch (error) {
			console.log(errorIndexes);
			console.error('[ReadGeoJson]:', error);
			window.alert('Ошибка при обработке GEOJSON');
		}
	};

	function generateJSON() {
		const result = {
			type: 'FeatureCollection',
			features: [],
		};
		if (checkedItems[0] && points.length > 0) {
			points.forEach((item, i) => {
				const type = 'Point';
				let coordinates;

				coordinates = item.ref.current.geometry.getCoordinates().reverse();

				result.features.push({
					id: i,
					type: type,
					geometry: {
						type: type,
						coordinates: coordinates,
					},
				});
			});
		}
		if (checkedItems[1] && polylines.length > 0) {
			polylines.forEach((item, i) => {
				const type = 'LineString';
				let coordinates;

				coordinates = item.ref.current.geometry.getCoordinates().map((el) => [el[1], el[0]]);

				result.features.push({
					id: i,
					type: type,
					geometry: {
						type: type,
						coordinates: coordinates,
					},
				});
			});
		}
		if (checkedItems[2] && polygons.length > 0) {
			polygons.forEach((item, i) => {
				const type = 'MultiPolygon';
				let coordinates;

				coordinates = item.ref.current.geometry
					.getCoordinates()
					.map((item) => item.map((coords) => copy(coords).reverse()));

				result.features.push({
					id: i,
					type: type,
					geometry: {
						type: type,
						coordinates: [coordinates],
					},
				});
			});
		}
		return result;
	}

	function copy(element) {
		const json = JSON.stringify(element);
		return JSON.parse(json);
	}

	function downloadJSON() {
		if (
			(checkedItems[0] && points.length > 0) ||
			(checkedItems[1] && polylines.length > 0) ||
			(checkedItems[2] && polygons.length > 0)
		) {
			const json = generateJSON();
			const bytes = new TextEncoder().encode(JSON.stringify(json));
			const blob = new Blob([bytes], { type: 'application/json;charset=utf-8' });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'geojson.json';
			a.click();
			window.URL.revokeObjectURL(url);
		} else {
			toast({
				title: 'Ошибка',
				description: 'Нет объектов выбранных типов',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	}

	const allChecked = checkedItems.every(Boolean);
	const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

	return (
		<div className={styles.frame}>
			<Heading
				as="h5"
				size="sm">
				Здесь Вы можете экспортировать выбранные типы объектов (GeoJSON)
			</Heading>
			<Stack direction={'row'}>
				<CheckboxGroup colorScheme="green">
					<Stack width={'250px'}>
						<Checkbox
							isChecked={allChecked}
							isIndeterminate={isIndeterminate}
							onChange={(e) => setCheckedItems([e.target.checked, e.target.checked, e.target.checked])}>
							Все объекты
						</Checkbox>
						<Stack
							w={'200px'}
							pl={6}
							// mt={1}
							spacing={1}
							direction={['column']}>
							<Checkbox
								isChecked={checkedItems[0]}
								onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1], checkedItems[2]])}>
								Точки
							</Checkbox>
							<Checkbox
								isChecked={checkedItems[1]}
								onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked, checkedItems[2]])}>
								Линии
							</Checkbox>
							<Checkbox
								isChecked={checkedItems[2]}
								onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked])}>
								Полигоны
							</Checkbox>
						</Stack>
					</Stack>
				</CheckboxGroup>
				<Button
					onClick={downloadJSON}
					isDisabled={!checkedItems.some(Boolean)}
					marginTop={'auto'}
					w={'200px'}
					colorScheme={'green'}>
					Экспортировать
				</Button>
			</Stack>

			<Heading
				as="h5"
				size="sm">
				Здесь Вы можете импортировать объекты (GeoJSON)
			</Heading>
			<Stack direction={'row'}>
				{' '}
				<Button
					minWidth={'250px'}
					maxWidth={'300px'}
					onClick={handleUploadClick}>
					{file ? `${file.name}` : 'Нажмите для выбора файла'}
				</Button>
				<Button
					isLoading={isReading}
					loadingText={'Чтение'}
					isDisabled={!file}
					colorScheme="green"
					w={'200px'}
					onClick={readFile}>
					Импортировать
				</Button>
				{file && (
					<Button
						isDisabled={isReading}
						colorScheme="red"
						w={'200px'}
						onClick={() => setFile(false)}>
						Сбросить
					</Button>
				)}
			</Stack>

			<input
				type="file"
				ref={inputRef}
				onChange={handleFileChange}
				style={{ display: 'none' }}
			/>
		</div>
	);
}

export default DataFrame;
