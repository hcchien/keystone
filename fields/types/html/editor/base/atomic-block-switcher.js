'use strict';

import { Entity } from 'draft-js';
import ENTITY from '../entities';
import Alignment from './block-alignment-wrapper';
import AudioBlock from '../audio/audio-block';
import EmbeddedCodeBlock from '../embedded-code/embedded-code-block';
import ImageBlock from '../image/image-block';
import ImageDiffBlock from '../image-diff/image-diff-block';
import InfoBoxBlock from '../info-box/info-box-block';
import React from 'react';
import SlideshowBlock from '../slideshow/slideshow-block';

class AtomicBlockSwitcher extends React.Component {
    constructor(props) {
        super(props);
        this.alignLeft = this._alignLeft.bind(this);
        this.alignCenter = this._alignCenter.bind(this);
        this.alignRight = this._alignRight.bind(this);
    }

    _alignLeft() {
        this.props.align('left');
    }

    _alignCenter() {
        this.props.align('center');
    }

    _alignRight() {
        this.props.align('right');
    }

    render() {
        const entityKey = this.props.block.getEntityAt(0);
        const type =  entityKey ? Entity.get(entityKey).getType(): null;

        const Buttons = (
            <div style={{textAlign: "center"}}>
                <span className="alignmentButton"
                    onClick={this.alignLeft}
                    style={{ marginLeft: '-2.4em' }}
                    role="button" key={'left'}
                    >
                    L
                </span>
                <span className="alignmentButton"
                    onClick={this.alignCenter}
                    role="button" key={'center'}
                    >
                    C
                </span>
                <span className="alignmentButton"
                    onClick={this.alignRight}
                    style={{ marginLeft: '0.9em' }}
                    role="button" key={'right'}
                    >
                    R
                </span>
            </div>
        );

        const { alignment } = this.props;
        let className = alignment;
        let BlockComponent;

        switch (type) {
            case ENTITY.audio.type:
                BlockComponent = AudioBlock;
                break;
            case ENTITY.embeddedCode.type:
                BlockComponent = EmbeddedCodeBlock;
                break;
            case ENTITY.infobox.type:
                BlockComponent = InfoBoxBlock;
                break;
            case ENTITY.image.type:
                BlockComponent = ImageBlock;
                break;
            case ENTITY.slideshow.type:
                BlockComponent = SlideshowBlock;
                break;
            case ENTITY.imageDiff.type:
                BlockComponent = ImageDiffBlock;
                break;
            default:
                return null;
        }
        if (!BlockComponent) {
          return null;
        }

        return (
            <BlockComponent
                {...this.props}
                className={className}
                >
                {Buttons}
            </BlockComponent>
        );
    }
}

export default Alignment(AtomicBlockSwitcher);
