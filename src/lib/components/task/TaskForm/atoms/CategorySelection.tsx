import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Flex,
	FormControl,
	FormControlProps,
	FormLabel,
	HStack,
	Spinner,
	useDisclosure,
} from '@chakra-ui/react';
import React, {
	LegacyRef,
	RefObject,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { FaPencilAlt, FaPlus } from 'react-icons/fa';
import IconButton from '@core/components/buttons/IconButton';
import List from '@core/components/List';
import { useAppStatus } from '@lib/hooks//useAppStatus';
import { ICategory } from '@lib/models/category';
import categoryLocalService from '@lib/services/category/category.local-service';
import categoryService from '@lib/services/category/category.service';
import style from '../style';
import Category from '@lib/components/category/Category';
import CategoryForm from '@lib/components/category/CategoryForm';

type CategorySelectionProps = {
	onSelect: (categoryId: string) => Promise<void> | void;
	selectedCategory: string;
} & Omit<FormControlProps, 'onSelect'>;
const CategorySelection = ({
	onSelect,
	selectedCategory,
	...rest
}: CategorySelectionProps) => {
	const [selectedCategoryId, setSelectedCategoryId] =
		useState(selectedCategory);
	const [categoryModels, setCategoryModels] = useState<ICategory[]>([]);
	const [categoryViews, setCategoryViews] = useState<any>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showCategoryAddForm, setShowCategoryAddForm] = useState(false);
	const [showCategoryEditForm, setShowCategoryEditForm] = useState(false);

	const [shouldRefresh, setShouldRefresh] = useState(true);
	const [pencilIconClicked, setPencilIconClicked] = useState(false);
	const [targetCategory, setTargetCategory] = useState<
		ICategory | undefined
	>();

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOnline } = useAppStatus();

	const cancelRef = React.useRef();

	useEffect(() => {
		async function fetchCategories() {
			let categoryModels = isOnline
				? await categoryService.findAll()
				: await categoryLocalService.findAll();

			setCategoryModels(categoryModels);
			setIsLoading(false);
		}

		if (shouldRefresh) {
			setIsLoading(true);
			fetchCategories();
			setShouldRefresh(false);
		}
	}, [shouldRefresh]);

	useEffect(() => {
		function refreshCategoryListViews() {
			const categoryViews = categoryModels.map((category) => {
				return {
					id: category._id,
					component: (
						<Category
							category={category}
							isSelected={
								selectedCategoryId &&
								category._id == selectedCategoryId
							}
						></Category>
					),
					data: category,
				};
			});
			setCategoryViews(categoryViews);
		}

		refreshCategoryListViews();
	}, [selectedCategoryId, categoryModels]);

	function onCategorySelectHandler(categoryId: string) {
		onSelect(categoryId);
		setSelectedCategoryId(categoryId);
	}

	async function onPencilClicked() {
		setTargetCategory(undefined);
		setPencilIconClicked((prev) => !prev);
	}

	function onCategoryAddIconClick() {
		setShowCategoryAddForm(true);
	}

	function onCategoryAddFormSubmit() {
		setShouldRefresh(true);
		setShowCategoryAddForm(false);
	}

	async function onCategoryDeleteConfirmed() {
		onClose();

		isOnline
			? await categoryService.deleteById(targetCategory!._id!)
			: await categoryLocalService.delete(targetCategory!._id!);
		setShouldRefresh(true);
		setTargetCategory(undefined);
	}

	async function onCategoryDeleteClicked(category: ICategory) {
		setTargetCategory(category);
		onOpen();
	}

	async function onCategoryEditFormSubmit() {
		setShowCategoryEditForm(false);

		setShouldRefresh(true);

		if (targetCategory) {
			setTargetCategory(undefined);
		}
	}

	async function onCategoryEditClicked(category: ICategory) {
		setTargetCategory(category);
		setShowCategoryEditForm(true);
	}
	const categoryList =
		!isLoading || categoryViews ? (
			<List
				items={categoryViews}
				onItemSelect={onCategorySelectHandler}
				showEditTools={pencilIconClicked}
				onDeleteClick={onCategoryDeleteClicked}
				onEditClick={onCategoryEditClicked}
			/>
		) : (
			<Spinner />
		);

	const deleteDialog = (
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={cancelRef as RefObject<any>}
			onClose={onClose}
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						Delete Category
					</AlertDialogHeader>

					<AlertDialogBody>
						Are you sure? You can't undo this action afterwards.
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button
							ref={cancelRef as LegacyRef<any>}
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							variant="solidRed"
							onClick={onCategoryDeleteConfirmed}
							ml={3}
						>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);

	return (
		<FormControl
			{...style.formControl}
			id="category"
			className="category-selection"
			isRequired
		>
			{showCategoryAddForm && (
				<CategoryForm
					onSubmit={onCategoryAddFormSubmit}
					onCancel={() => setShowCategoryAddForm(false)}
				/>
			)}
			{showCategoryEditForm && (
				<CategoryForm
					category={targetCategory}
					onSubmit={onCategoryEditFormSubmit}
					onCancel={() => setShowCategoryEditForm(false)}
				/>
			)}

			{deleteDialog}

			<Flex w="100%" h={rest.height || '150px'} flexDir="column">
				<HStack spacing={0.1} w="100px">
					<FormLabel>Categories</FormLabel>

					<HStack opacity={0.3}>
						<IconButton
							onClick={onCategoryAddIconClick}
							icon={FaPlus}
							size={3}
							color={'black'}
							hoverColor={'brand.blue.200'}
						/>
						<IconButton
							onClick={onPencilClicked}
							icon={FaPencilAlt}
							size={3}
							color={'black'}
							hoverColor={'brand.blue.200'}
						/>
					</HStack>
				</HStack>

				<Scrollbars
					className="category-selection__icon-select-scrollbar"
					style={{ width: '100%' }}
					autoHide={true}
				>
					<Flex
						flexDirection="row"
						flexWrap={'wrap'}
						alignItems="center"
					>
						{!isLoading ? (
							categoryList
						) : (
							<Flex w="100%" justifyContent="center">
								<Spinner />
							</Flex>
						)}
					</Flex>
				</Scrollbars>
			</Flex>
		</FormControl>
	);
};

export default CategorySelection;
