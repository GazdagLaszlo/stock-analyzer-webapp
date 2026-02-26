import { COLORS } from '../constants/colors';

type Props = {
  text: string;
};

const InfoButton = ({ text }: Props) => (
  <div className="dropdown is-hoverable is-left ml-1">
    <div className="dropdown-trigger">
      <span className="icon is-small has-text-grey-light">
        <span className="icon mr-2">
          <i className="fa-regular fa-circle-question"></i>
        </span>
      </span>
    </div>
    <div className="dropdown-menu" role="menu">
      <div
        className="dropdown-content p-3 is-size-6 has-text-weight-normal"
        style={{
          minWidth: '20vw',
          whiteSpace: 'normal',
          lineHeight: '1.4',
          color: COLORS.infoText,
        }}
      >
        {text}
      </div>
    </div>
  </div>
);

export default InfoButton;
