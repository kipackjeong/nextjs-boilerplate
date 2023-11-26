import React, { useState } from 'react';
import { InterviewPanel } from '../../../contents/InterviewPanel';
import { VFlex } from '@/core/Flex/VFlex';
import { SpeechPanel } from '@/contents/SpeechPanel';
import axios from 'axios';
import { cookies } from 'next/headers';

export default async function Page() {
	return (
		<VFlex width="100%">
			<InterviewPanel />
		</VFlex>
	);
}
