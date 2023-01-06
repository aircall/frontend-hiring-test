import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../../gql/queries/getCallDetails';
import { Box, Button, FormItem, Modal, Spacer, TextFieldInput, Typography, useToast } from '@aircall/tractor';
import { formatDate, formatDuration } from '../../helpers/dates';
import { Constants } from '../../constants/constants';
import { useState } from 'react';
import { UPDATE_CALL } from '../../gql/mutations/updateCall';
import { ADD_NOTE } from '../../gql/mutations/addNote';

export const CallDetailsPage = () => {
  const navigate = useNavigate();
  const [call, setCall] = useState<Call>();
  const [search] = useSearchParams();
  const { callId } = useParams();
  const pageQueryParams = search.get('page');
  const size = search.get('size');
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;
  const [note, setNote] = useState('');
  const NOTE_REQUIRED = 'NOTE_REQUIRED';

  const [isOpen, toggleModal] = useState(false);
  const { showToast, removeToast } = useToast();


  const { loading, error, data } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    },
    onCompleted: (data) => handleCall(data),
  });
  const [archiveCall] = useMutation(UPDATE_CALL);
  const [addNote] = useMutation(ADD_NOTE);

  const handleCall = (data: any) => {
    const { call } = data;
    setCall(call);
  };

  const handleCallOnClickBack = () => {
    navigate(`/calls?page=${activePage}&size=${size}`);
  };

  // Toggle isArchive call
  const archiveToggle = () => {
    archiveCall({
      variables: { id: call?.id },
      onCompleted: (updatedCall) => {
        setCall(updatedCall.archiveCall)
      },
    })
  };

  // Show modal to add a new note on the call
  const showModal = () => {
    toggleModal(true);
  };

  const closeModal = () => {
    toggleModal(false);
  };

  // Save the new note on the call
  const saveModal = () => {

    if(!note) {
      showToast({
        id: NOTE_REQUIRED,
        message: 'Note is required.',
        variant: 'error'
      });
      return;
    }
    addNote({
      variables: { input: { activityId: call?.id, content: note } },
      onCompleted: (noteCall) => {
        setCall(noteCall.addNote)
      },
    })
    toggleModal(false);
  };

  if (loading) return <p>Loading call details...</p>;
  if (error) return <p>ERROR</p>;

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls Details
      </Typography>
      {call && <>
        <Spacer space="s" marginLeft="10">
          <Button mode="link"  onClick={showModal}>New Note</Button>
          {call.is_archived && <Button mode="link" onClick={archiveToggle}>Unarchive</Button>}
          {!call.is_archived && <Button mode="link" onClick={archiveToggle}>Archive</Button>}
          <Button mode="link" onClick={handleCallOnClickBack}>Back to Calls</Button>
        </Spacer>
        <Box overflowY="auto" bg="black-a30" p={4} borderRadius={16}>
          <div>{`ID: ${call.id}`}</div>
          <div>{`Type: ${call.call_type}`}</div>
          <div>{`Created at: ${formatDate(call.created_at)}`}</div>
          <div>{`Direction: ${call.direction}`}</div>
          <div>{`From: ${call.from}`}</div>
          <div>{`Duration: ${formatDuration(call.duration / 1000)}`}</div>
          <div>{`Is archived: ${call.is_archived}`}</div>
          <div>{`To: ${call.to}`}</div>
          <div>{`Via: ${call.via}`}</div>
          {call.notes?.map((note: Note, index: number) => {
            return <div key={note.id}>{`Note ${index + 1}: ${note.content}`}</div>;
          })}
        </Box>
        <Modal.Dialog show={isOpen} onHide={closeModal}>
          <Modal.Header>
            <Modal.Title>New note</Modal.Title>
          </Modal.Header>
          <Modal.Body p="m">
          <FormItem label="Note" name="note">
          <TextFieldInput
            placeholder="note"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </FormItem>
          </Modal.Body>
          <Modal.Footer>
          <Button mode="link" type="button" onClick={saveModal}>
              Save
            </Button>
            <Button mode="link" type="button" onClick={closeModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </>
      }
    </>
  );
};


