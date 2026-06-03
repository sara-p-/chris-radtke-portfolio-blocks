/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	URLInput,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	RangeControl,
	Button,
	TextControl,
	FocalPointPicker,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const {
		minHeight,
		backgroundImage,
		backgroundSize,
		backgroundPosition,
		backgroundRepeat,
		backgroundAttachment,
		focalPoint,
		linkUrl,
		linkTarget,
	} = attributes;

	const blockProps = useBlockProps( {
		style: {
			minHeight: minHeight || '300px',
			backgroundImage: backgroundImage?.url
				? `url(${ backgroundImage.url })`
				: undefined,
			backgroundSize: backgroundSize || 'cover',
			backgroundPosition: focalPoint
				? `${ focalPoint.x * 100 }% ${ focalPoint.y * 100 }%`
				: backgroundPosition || 'center center',
			backgroundRepeat: backgroundRepeat || 'no-repeat',
			backgroundAttachment: backgroundAttachment || 'scroll',
			display: 'block',
			cursor: 'pointer',
			position: 'relative',
		},
	} );

	return (
		<>
			<InspectorControls>
				{ /* --- Dimensions Panel --- */ }
				<PanelBody
					title={ __( 'Dimensions', 'chris-radtke-portfolio-blocks' ) }
					initialOpen={ true }
				>
					<PanelRow>
						
						<UnitControl
							label={ __( 'Min Height', 'chris-radtke-portfolio-blocks' ) }
							value={ minHeight || '300px' }
							onChange={ ( value ) => setAttributes( { minHeight: value } ) }
							units={ [
								{ value: 'px', label: 'px', default: 300 },
								{ value: 'vh', label: 'vh', default: 50 },
								{ value: 'rem', label: 'rem', default: 20 },
								{ value: '%', label: '%', default: 50 },
							] }
						/>
					</PanelRow>
				</PanelBody>

				{ /* --- Background Image Panel --- */ }
				<PanelBody
					title={ __( 'Background Image', 'chris-radtke-portfolio-blocks' ) }
					initialOpen={ true }
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									backgroundImage: {
										id: media.id,
										url: media.url,
										alt: media.alt,
									},
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ backgroundImage?.id }
							render={ ( { open } ) => (
								<>
									{ backgroundImage?.url ? (
										<>
											<img
												src={ backgroundImage.url }
												alt={ backgroundImage.alt || '' }
												style={ {
													width: '100%',
													height: 'auto',
													marginBottom: '8px',
													display: 'block',
												} }
											/>
											<Button
												variant="secondary"
												onClick={ open }
												style={ { marginRight: '8px' } }
											>
												{ __( 'Replace Image', 'chris-radtke-portfolio-blocks' ) }
											</Button>
											<Button
												variant="link"
												isDestructive
												onClick={ () =>
													setAttributes( { backgroundImage: undefined } )
												}
											>
												{ __( 'Remove Image', 'chris-radtke-portfolio-blocks' ) }
											</Button>
										</>
									) : (
										<Button variant="primary" onClick={ open }>
											{ __( 'Select Image', 'chris-radtke-portfolio-blocks' ) }
										</Button>
									) }
								</>
							) }
						/>
					</MediaUploadCheck>

					{ backgroundImage?.url && (
						<>
							<br />
							<FocalPointPicker
								label={ __( 'Focal Point', 'chris-radtke-portfolio-blocks' ) }
								url={ backgroundImage.url }
								value={ focalPoint || { x: 0.5, y: 0.5 } }
								onChange={ ( value ) => setAttributes( { focalPoint: value } ) }
							/>
						</>
					) }

					<SelectControl
						label={ __( 'Background Size', 'chris-radtke-portfolio-blocks' ) }
						value={ backgroundSize || 'cover' }
						options={ [
							{ label: __( 'Cover' ), value: 'cover' },
							{ label: __( 'Contain' ), value: 'contain' },
							{ label: __( 'Auto' ), value: 'auto' },
							{ label: __( '100%' ), value: '100%' },
						] }
						onChange={ ( value ) => setAttributes( { backgroundSize: value } ) }
					/>

					<SelectControl
						label={ __( 'Background Repeat', 'chris-radtke-portfolio-blocks' ) }
						value={ backgroundRepeat || 'no-repeat' }
						options={ [
							{ label: __( 'No Repeat' ), value: 'no-repeat' },
							{ label: __( 'Repeat' ), value: 'repeat' },
							{ label: __( 'Repeat X' ), value: 'repeat-x' },
							{ label: __( 'Repeat Y' ), value: 'repeat-y' },
							{ label: __( 'Space' ), value: 'space' },
							{ label: __( 'Round' ), value: 'round' },
						] }
						onChange={ ( value ) => setAttributes( { backgroundRepeat: value } ) }
					/>

					<SelectControl
						label={ __( 'Background Attachment', 'chris-radtke-portfolio-blocks' ) }
						value={ backgroundAttachment || 'scroll' }
						options={ [
							{ label: __( 'Scroll' ), value: 'scroll' },
							{ label: __( 'Fixed (Parallax)' ), value: 'fixed' },
							{ label: __( 'Local' ), value: 'local' },
						] }
						onChange={ ( value ) =>
							setAttributes( { backgroundAttachment: value } )
						}
					/>
				</PanelBody>

				{ /* --- Link Panel --- */ }
				<PanelBody
					title={ __( 'Link', 'chris-radtke-portfolio-blocks' ) }
					initialOpen={ true }
				>
					<PanelRow>
						<div style={ { width: '100%' } }>
							<URLInput
								label={ __( 'URL', 'chris-radtke-portfolio-blocks' ) }
								value={ linkUrl || '' }
								onChange={ ( value ) => setAttributes( { linkUrl: value } ) }
							/>
						</div>
					</PanelRow>
					<SelectControl
						label={ __( 'Open in', 'chris-radtke-portfolio-blocks' ) }
						value={ linkTarget || '_self' }
						options={ [
							{ label: __( 'Same Tab' ), value: '_self' },
							{ label: __( 'New Tab' ), value: '_blank' },
						] }
						onChange={ ( value ) => setAttributes( { linkTarget: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Block preview in editor */ }
			<a { ...blockProps }>
				{ ! backgroundImage?.url && (
					<span
						style={ {
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							color: '#999',
							fontSize: '13px',
							pointerEvents: 'none',
						} }
					>
						{ __( 'Image Button — select a background image in the panel', 'chris-radtke-portfolio-blocks' ) }
					</span>
				) }
			</a>
		</>
	);
}