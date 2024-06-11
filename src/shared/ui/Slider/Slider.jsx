import React from 'react';

import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark } from '@chakra-ui/react';

function OpacitySlider({ value, setValue }) {
	const labelStyles = {
		mt: '2',
		ml: '-2.5',
		fontSize: 'sm',
	};

	return (
		<Slider
			width={'250px'}
			defaultValue={value}
			min={0}
			max={1}
			step={0.01}
			aria-label="slider-ex-6"
			onChange={(val) => setValue(val)}>
			<SliderMark
				value={0.25}
				{...labelStyles}>
				0.25
			</SliderMark>
			<SliderMark
				value={0.5}
				{...labelStyles}>
				0.5
			</SliderMark>
			<SliderMark
				value={0.75}
				{...labelStyles}>
				0.75
			</SliderMark>
			<SliderMark
				value={value}
				textAlign="center"
				bg="#c6f6d5"
				color="black"
				mt="-10"
				ml="-5"
				w="12">
				{value}
			</SliderMark>
			<SliderTrack>
				<SliderFilledTrack bg="#c6f6d5" />
			</SliderTrack>
			<SliderThumb />
		</Slider>
	);
}

export default OpacitySlider;
