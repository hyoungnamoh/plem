import React from 'react';
import Svg, { G, Text } from 'react-native-svg';

import Circle from './Circle';
import Sectors from './Sectors';

class PieChart extends React.Component {
  renderSingleData(d, center) {
    return <Circle center={center} radius={center} {...d} />;
  }

  renderMultipleData(center) {
    const { data, expandOnHover, ...props } = this.props;
    return <Sectors center={center} data={data} {...props} />;
  }

  shouldExpand = () => {
    const { data, expandOnHover } = this.props;
    const oneDataIsExpanded = data.some((d) => d.expanded);
    return oneDataIsExpanded || expandOnHover;
  };

  render() {
    const { data, expandSize, viewBoxSize } = this.props;
    const center = viewBoxSize / 2;
    const offset = this.shouldExpand() ? expandSize : 0;
    const dataWithValue = data.filter((d) => d.value > 0);
    return dataWithValue && dataWithValue.length > 0 ? (
      <Svg viewBox={`0 0 ${viewBoxSize + offset * 2} ${viewBoxSize + offset * 2}`} style={this.props.style}>
        <G transform={`translate(${offset}, ${offset})`}>
          {dataWithValue.length === 1
            ? this.renderSingleData(dataWithValue[0], center)
            : this.renderMultipleData(center)}
        </G>
      </Svg>
    ) : null;
  }
}

export default PieChart;
