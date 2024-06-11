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
import { Placemark } from '@pbe/react-yandex-maps';

function TablePoints({ points, setPoints, styles }) {
	return (
		<Table
			variant="striped"
			colorScheme="red">
			<TableCaption className="caption">
				<div className={styles.row}>
					В этой таблице будут отображены все созданные точки
					{points.length > 0 && (
						<Button
							marginLeft={'10px'}
							colorScheme="red"
							onClick={() => setPoints([])}>
							Удалить все точки
						</Button>
					)}
				</div>
			</TableCaption>
			<Thead>
				<Tr>
					<Th>ID точки</Th>
					<Th>Координата X</Th>
					<Th>Координата Y</Th>
					<Th isNumeric={true}>Редактирование</Th>
					<Th isNumeric={true}>Удалить</Th>
				</Tr>
			</Thead>
			<Tbody>
				{points.map((el, index) => {
					// let coords  = el.ref.current.geometry.getCoordinates()
					return (
						<Tr key={index}>
							<Td>{index + 1}</Td>
							<Td>{el.object.props.geometry[0].toFixed(5)}</Td>
							<Td>{el.object.props.geometry[1].toFixed(5)}</Td>
							<Td isNumeric={true}>
								<Popover>
									<PopoverTrigger>
										<Button
											width={'150px'}
											colorScheme="gray"
											variant="solid">
											Редактировать
										</Button>
									</PopoverTrigger>
									<Portal>
										<PopoverContent>
											<PopoverArrow />
											<PopoverHeader>Редактирование стиля</PopoverHeader>
											<PopoverCloseButton />
											<PopoverBody>
												<ColorPicker
													colorDefault={el.object.props.options.iconColor}
													onChange={(color) => {
														setPoints((prev) => {
															return prev.map((element) =>
																element.object.key !== el.object.key
																	? element
																	: {
																			ref: element.ref,
																			object: (
																				<Placemark
																					instanceRef={element.ref}
																					key={element.object.key}
																					properties={
																						element.object.props.properties
																					}
																					options={{
																						...element.object.props.options,
																						iconColor: color,
																					}}
																					geometry={
																						element.object.props.geometry
																					}
																				/>
																			),
																	  },
															);
														});
													}}
												/>
											</PopoverBody>
										</PopoverContent>
									</Portal>
								</Popover>
							</Td>
							<Td isNumeric={true}>
								<Button
									width={'100px'}
									colorScheme="red"
									onClick={() => {
										setPoints((prev) =>
											prev
												.filter((item) => item.object.key !== el.object.key)
												.map((point, id) => {
													return {
														ref: point.ref,
														object: (
															<Placemark
																instanceinstanceRef={point.ref}
																key={point.object.key}
																properties={{
																	iconContent: id + 1,
																}}
																options={point.object.props.options}
																geometry={point.object.props.geometry}
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

export default TablePoints;
