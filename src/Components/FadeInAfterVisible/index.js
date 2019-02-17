import React, {cloneElement} from 'react';
import classnames from 'classnames';
import TrackVisibility from 'react-on-screen';
import 'animate.css';

const TrackedComponent = props => {
  const visibilityClasses = props.isVisible
    ? classnames({
        animated: true,
        [props.action]: true
      })
    : classnames({});

  const visibilityStyles = !props.isVisible
    ? {
        visibility: 'hidden'
      }
    : {};

  return (
    <React.Fragment>
      {cloneElement(props.children, {
        ...props,
        visibilityClasses,
        visibilityStyles
      })}
    </React.Fragment>
  );
};

const FadeIn = props => (
  <TrackVisibility once>
    <TrackedComponent {...props} />
  </TrackVisibility>
);

export default FadeIn;
