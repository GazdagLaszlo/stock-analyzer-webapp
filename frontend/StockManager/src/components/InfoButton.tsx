type Props = {
  text: string;
};

const InfoButton = ({ text }: Props) => (
  <div className="dropdown is-hoverable is-right ml-1">
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
        style={{ width: '200px', whiteSpace: 'normal', lineHeight: '1.4' }}
      >
        {text}
      </div>
    </div>
  </div>
);

export default InfoButton;
