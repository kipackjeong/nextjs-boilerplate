'use client';
import { GetServerSideProps } from 'next';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const DevPage = () => {
	useEffect(() => {
		redirect('/dev/live-interview');
	}, []);
	return <div>Enter</div>;
};

export default DevPage;
