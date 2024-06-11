import React from 'react';
import {
	Button,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableCaption,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverArrow,
	PopoverCloseButton,
	Portal,
} from '@chakra-ui/react';
import ColorPicker from '../PopoverColorPicker/ColorPicker';
import { Polygon } from '@pbe/react-yandex-maps';
import OpacitySlider from '../../shared/ui/Slider/Slider';

function TablePolygons({ polygons, printMode, type, setPolygons, styles }) {
	return (
		<Table
			variant="striped"
			colorScheme="green">
			<TableCaption>
				<div className={styles.row}>
					В этой таблице будут отображены все созданные полигоны{' '}
					{polygons.length > 0 && (
						<Button
							width={'200px'}
							isLoading={printMode && type === 'Polygon'}
							loadingText={'Ожидание'}
							marginLeft={'10px'}
							colorScheme="red"
							onClick={() => {
								setPolygons([]);
							}}>
							Удалить все полигоны
						</Button>
					)}
				</div>
			</TableCaption>
			<Thead>
				<Tr>
					<Th>ID полигона</Th>
					<Th isNumeric={true}>Редактирование</Th>
					<Th isNumeric={true}>Удаление</Th>
				</Tr>
			</Thead>
			<Tbody>
				{polygons.map((el, index) => {
					return (
						<Tr key={index}>
							<Td>{index + 1}</Td>
							<Td isNumeric={true}>
								<Popover>
									<PopoverTrigger>
										<Button
											isDisabled={
												index === polygons.length - 1 && printMode && type === 'Polygon'
											}
											width={'150px'}
											colorScheme="gray"
											variant="solid">
											Редактировать
										</Button>
									</PopoverTrigger>
									<Portal>
										<PopoverContent
											width={'400px'}
											paddingBottom={'20px'}>
											<PopoverArrow />
											<PopoverHeader>Редактирование стиля</PopoverHeader>
											<PopoverCloseButton />
											<PopoverBody className={styles.popover__body}>
												<div className={styles.row}>
													Линия:{' '}
													<ColorPicker
														colorDefault={el.object.props.options.strokeColor}
														onChange={(color) => {
															setPolygons((prev) => {
																return prev.map((element) =>
																	element.object.key !== el.object.key
																		? element
																		: {
																				ref: element.ref,
																				object: (
																					<Polygon
																						instanceRef={element.ref}
																						key={element.object.key}
																						properties={
																							element.object.props
																								.properties
																						}
																						options={{
																							...element.object.props
																								.options,
																							strokeColor: color,
																						}}
																						geometry={
																							element.object.props
																								.geometry
																						}
																					/>
																				),
																		  },
																);
															});
														}}
													/>
												</div>
												<div className={styles.row}>
													Заливка:{' '}
													<ColorPicker
														colorDefault={el.object.props.options.fillColor}
														onChange={(color) => {
															setPolygons((prev) => {
																return prev.map((element) =>
																	element.object.key !== el.object.key
																		? element
																		: {
																				ref: element.ref,
																				object: (
																					<Polygon
																						instanceRef={element.ref}
																						key={element.object.key}
																						properties={
																							element.object.props
																								.properties
																						}
																						options={{
																							...element.object.props
																								.options,
																							fillColor: color,
																						}}
																						geometry={
																							element.object.props
																								.geometry
																						}
																					/>
																				),
																		  },
																);
															});
														}}
													/>
												</div>
												<div className={styles.row}>
													Прозрачность:{' '}
													<OpacitySlider
														value={el.object.props.options.fillOpacity}
														setValue={(value) => {
															setPolygons((prev) => {
																return prev.map((element) =>
																	element.object.key !== el.object.key
																		? element
																		: {
																				ref: element.ref,
																				object: (
																					<Polygon
																						instanceRef={element.ref}
																						key={element.object.key}
																						properties={
																							element.object.props
																								.properties
																						}
																						options={{
																							...element.object.props
																								.options,
																							fillOpacity: value,
																						}}
																						geometry={
																							element.object.props
																								.geometry
																						}
																					/>
																				),
																		  },
																);
															});
														}}
													/>
												</div>
											</PopoverBody>
										</PopoverContent>
									</Portal>
								</Popover>
							</Td>
							<Td isNumeric={true}>
								<Button
									isDisabled={index === polygons.length - 1 && printMode && type === 'Polygon'}
									width={'150px'}
									colorScheme="red"
									variant="solid"
									onClick={() => {
										setPolygons((prev) =>
											prev
												.filter((item) => item.object.key !== el.object.key)
												.map((polygon) => {
													return {
														ref: polygon.ref,
														object: (
															<Polygon
																instanceRef={polygon.ref}
																key={polygon.object.key}
																options={polygon.object.props.options}
																properties={polygon.object.props.properties}
																geometry={polygon.object.props.geometry}
															/>
														),
													};
												}),
										);
									}}>
									Удалить
								</Button>
							</Td>
						</Tr>
					);
				})}
			</Tbody>
		</Table>
	);
}

export default TablePolygons;
