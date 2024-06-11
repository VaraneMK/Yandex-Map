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
import { Polyline } from '@pbe/react-yandex-maps';

function TablePolylines({ polylines, printMode, type, setPolylines, styles }) {
	return (
		<Table
			variant="striped"
			colorScheme="purple">
			<TableCaption>
				<div className={styles.row}>
					В этой таблице будут отображены все созданные линии{' '}
					{polylines.length > 0 && (
						<Button
							width={'200px'}
							isLoading={printMode && type === 'Polyline'}
							loadingText={'Ожидание'}
							marginLeft={'10px'}
							colorScheme="red"
							onClick={() => setPolylines([])}>
							Удалить все линии
						</Button>
					)}
				</div>
			</TableCaption>
			<Thead>
				<Tr>
					<Th>ID линии</Th>
					<Th isNumeric={true}>Редактирование</Th>
					<Th isNumeric={true}>Удаление</Th>
				</Tr>
			</Thead>
			<Tbody>
				{polylines.map((el, index) => {
					return (
						<Tr key={index}>
							<Td>{index + 1}</Td>
							<Td isNumeric={true}>
								<Popover>
									<PopoverTrigger>
										<Button
											isDisabled={
												index === polylines.length - 1 && printMode && type === 'Polyline'
											}
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
													colorDefault={el.object.props.options.strokeColor}
													onChange={(color) => {
														setPolylines((prev) => {
															return prev.map((element) =>
																element.object.key !== el.object.key
																	? element
																	: {
																			ref: element.ref,
																			object: (
																				<Polyline
																					instanceRef={element.object.ref}
																					key={element.object.key}
																					properties={
																						element.object.props.properties
																					}
																					options={{
																						...element.object.props.options,
																						strokeColor: color,
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
									isDisabled={index === polylines.length - 1 && printMode && type === 'Polyline'}
									width={'150px'}
									colorScheme="red"
									variant="solid"
									onClick={() => {
										setPolylines((prev) =>
											prev
												.filter((item) => el.object.key !== item.object.key)
												.map((polyline) => {
													return {
														ref: polyline.ref,
														object: (
															<Polyline
																instanceRef={polyline.object.ref}
																key={polyline.object.key}
																properties={polyline.object.props.properties}
																options={polyline.object.props.options}
																geometry={polyline.object.props.geometry}
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

export default TablePolylines;
