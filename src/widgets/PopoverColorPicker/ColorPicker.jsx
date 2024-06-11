import React, { useCallback, useRef, useState } from 'react';
import useClickOutside from '../../shared/lib/useClickOutside';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@chakra-ui/react';

function ColorPicker({ colorDefault, onChange }) {
	const popover = useRef();
	const [isOpen, toggle] = useState(false);
	// const [color, setColor] = useState(colorDefault);
	const close = useCallback(() => toggle(false), []);
	useClickOutside(popover, close);

	return (
		<div className="picker">
			<Button
				position={'relative'}
				width={'100%'}
				bgColor={colorDefault}
				onClick={() => toggle(true)}>
				Текущий цвет : {colorDefault}
			</Button>

			{isOpen && (
				<div
					className="popover"
					ref={popover}>
					<HexColorPicker
						color={colorDefault}
						onChange={(color) => {
							// setColor(color);
							onChange(color);
						}}
					/>
				</div>
			)}
		</div>
	);
}

export default ColorPicker;
