'use strict';
import { Button, ButtonGroup } from 'elemental';
import { Entity } from 'draft-js';
import _ from 'lodash';
import AnnotationBt from './annotation/annotation-bt';
import AudioButton from './audio/audio-bt';
import EmbeddedCodeBt from './embedded-code/embedded-code-bt';
import ENTITY from './entities';
import ImageButton from './image/image-button';
import InfoBoxBt from './info-box/info-box-bt'
import LinkButton from './link/link-button';
import React from 'react';

class StyleButton extends React.Component {
	constructor () {
		super();
		this.onToggle = (e) => {
			e.preventDefault();
			this.props.onToggle(this.props.style);
		};
	}

	render () {
		let className = '';
		if (this.props.active) {
			className += ' RichEditor-activeButton';
		}

		return (
			<Button
				type="default"
				className={className + ' tooltip-box'}
				onMouseDown={this.onToggle}
				data-tooltip={this.props.label}>
				<i className={'fa ' + this.props.icon}></i>
				<span>{this.props.text}</span>
			</Button>
		);
	}
}

export const BlockStyleButtons = (props) => {
	const { editorState, buttons, onToggle } = props;
	const selection = editorState.getSelection();
	const blockType = editorState
	.getCurrentContent()
	.getBlockForKey(selection.getStartKey())
	.getType();
	return (
		<ButtonGroup>
			{_.map(buttons, (button) =>
				<StyleButton
					key={button.label}
					active={button.style === blockType}
					label={button.label}
					onToggle={onToggle}
					style={button.style}
					icon={button.icon}
					text={button.text}
				/>
			)}
		</ButtonGroup>
	);
};


export const InlineStyleButtons = (props) => {
  const { editorState, buttons, onToggle } = props;
	let currentStyle = editorState.getCurrentInlineStyle();
	return (
		<ButtonGroup>
			{_.map(buttons, (button) =>
				<StyleButton
          key={button.label}
					active={currentStyle.has(button.style)}
					label={button.label}
					onToggle={onToggle}
					style={button.style}
					icon={button.icon}
					text={button.text}
				/>
			)}
		</ButtonGroup>
	);
};

export const EntityButtons = (props) => {
    const { editorState, entities } = props;
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const startBlock = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey());

    const endOffset = selection.getEndOffset();
    let data;
    let entityInstance;
    let entityKey;
    let selectedText = '';

    if (!selection.isCollapsed()) {
        const blockText = startBlock.getText();
        selectedText = blockText.slice(startOffset, endOffset);
        entityKey = startBlock.getEntityAt(startOffset);
    } else {
        entityKey = startBlock.getEntityAt(0);
    }

    if (entityKey !== null) {
        entityInstance = Entity.get(entityKey);
        data = entityInstance.getData();
    }

    function onToggle (entity, changedValue) {
        props.onToggle(entity, changedValue);
    }

    function chooseButton (entity) {
        let active = entityInstance ? entityInstance.getType() === entity : false;
        switch (entity) {
            case ENTITY.annotation.type:
                return (
                    <AnnotationBt
                        active={active}
                        key={entity}
                        label={entity}
                        onToggle={onToggle.bind(null, entity)}
                        text={data ? data.text : selectedText}
                        annotation = {data ? data.annotation : ''}
                        icon='fa-pencil-square-o'
                        iconText=''
                    />
                );
            case ENTITY.audio.type:
                return (
                    <AudioButton
                        active={active}
                        apiPath="audios"
                        key={entity}
                        label={entity}
                        onToggle={onToggle.bind(null, entity)}
                        icon='fa-file-audio-o'
                        iconText=' Audio'
                    />
                )
            case ENTITY.infobox.type:
                return (
                    <InfoBoxBt
                        active={active}
                        key={entity}
                        label={entity}
                        onToggle={onToggle.bind(null, entity)}
                        title={data ? data.title : selectedText}
                        body = {data ? data.body : ''}
                        icon=''
                        iconText='infobox'
                    />
                );
            case ENTITY.link.type:
                return (
                    <LinkButton
                        active={active}
                        key={entity}
                        label={entity}
                        onToggle={onToggle.bind(null, entity)}
                        url={data ? data.url : ''}
                        text={data ? data.text : selectedText}
                        icon='fa-link'
                        iconText=''
                    />
                );
            case ENTITY.image.type:
                return (
                    <ImageButton
                        active={active}
                        apiPath="images"
                        key={entity}
                        label={entity}
                        onToggle={onToggle.bind(null, entity)}
                        icon='fa-photo'
                        iconText=' Image'
                    />
                );
            case ENTITY.slideshow.type:
                return (
                    <ImageButton
                        active={active}
                        apiPath="images"
                        key={entity}
                        label={entity}
                        onToggle={onToggle.bind(null, entity)}
                        selectionLimit={ENTITY.slideshow.slideshowSelectionLimit}
                        icon='fa-slideshare'
                        iconText=' Slideshow'
                    />
                );
            case ENTITY.imageDiff.type:
                return (
                    <ImageButton
                        active={active}
                        apiPath="images"
                        key={entity}
                        label={entity}
                        onToggle={onToggle.bind(null, entity)}
                        selectionLimit={2}
                        icon='fa-object-ungroup'
                        iconText=' Diff'
                    />
                );
            case ENTITY.embeddedCode.type:
                return (
                    <EmbeddedCodeBt
                        active={active}
                        key={entity}
                        label={entity}
                        onToggle={onToggle.bind(null, entity)}
                        caption={data ? data.caption : ''}
                        embeddedCode={data ? data.embeddedCode : ''}
                        iconText=' Embedded'
                    />
                );
            default:
                return;
        }
    }

    return (
        <ButtonGroup>
          {_.map(entities, entity => chooseButton(entity))}
        </ButtonGroup>
    );
};
