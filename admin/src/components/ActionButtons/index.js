import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { Button } from '@buffetjs/core';
import ConfirmModal from '../ConfirmModal';
import { exportAllConfig, importAllConfig } from '../../state/actions/Config';

const ActionButtons = ({ diff }) => {
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  const closeModal = () => {
    setActionType('');
    setModalIsOpen(false);
  };

  const openModal = (type) => {
    setActionType(type);
    setModalIsOpen(true);
  };

  return (
    <ActionButtonsStyling>
      <Button disabled={isEmpty(diff.fileConfig)} color="primary" label="Import" onClick={() => openModal('import')} />
      <Button disabled={isEmpty(diff.fileConfig)} color="primary" label="Export" onClick={() => openModal('export')} />
      <ConfirmModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        type={actionType} 
        onSubmit={() => actionType === 'import' ? dispatch(importAllConfig()) : dispatch(exportAllConfig())}
      />
    </ActionButtonsStyling>
  );
}

const ActionButtonsStyling = styled.div`
  padding: 10px 0 20px 0;

  > button {
    margin-right: 10px;
  }
`;
 
export default ActionButtons;