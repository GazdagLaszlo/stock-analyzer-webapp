import { useEffect, useRef, useState } from 'react';
import type { UserUpdateDto } from '../../../generated-sources/openapi';

type Props = {
  open: boolean;
  onClose: () => void;
  oldName: string | null | undefined;
  onUpdate: (updateDto: UserUpdateDto) => void;
};

const UpdateUserModal = ({ open, onClose, oldName, onUpdate }: Props) => {
  const [user, setUser] = useState<UserUpdateDto>({
    name: oldName,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUser({ name: oldName ?? '' });

      inputRef.current?.focus();
    }
  }, [open, oldName]);

  return (
    <div className={`modal ${open ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="card p-6">
          <h1 className="title is-4 mb-6">Edit Profile</h1>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={user.name ?? ''}
                ref={inputRef}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
          </div>
          <div className="is-flex is-justify-content-center mt-6">
            <button
              className="button button-navy"
              onClick={() => {
                onUpdate(user);
                onClose();
                setUser({});
              }}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default UpdateUserModal;
