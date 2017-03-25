import UploadField from '../../src/upload-field';
import Uploader from '../../src/uploader';

test('Triggers upload', async () => {
  let progressValue = 0;
  let completedValue = false;

  const output = mount(
    <Uploader
      request={{
        url: 'http://test.dev',
        method: 'POST',
      }}
      uploadOnSelection={true}
      onComplete={response => completedValue = response}
    >
      {({ onFiles, startUpload, progress, complete, canceled, failed }) => {
        if (progress) progressValue = progress;
        return (
          <div>
            <UploadField onFiles={onFiles}>
              <div>
                Click here and select a file!
              </div>
            </UploadField>
            {progress ? `Progress: ${progress}` : null}
            {complete ? 'Complete!' : null}
            {canceled ? 'Canceled!' : null}
            {failed ? 'Failed!' : null}
          </div>
        );
      }}
    </Uploader>
  );

  output
    .find('input')
    .simulate('change', { target: { files: [{ name: 'test ' }] } });

  await sleep(500);
  expect(progressValue).toEqual(50);

  expect(completedValue).toEqual({ finished: 'hell yes' });
});

test('Triggers upload with headers and extra fields', async () => {
  let progressValue = 0;
  let wasCompleted = false;

  const output = mount(
    <Uploader
      request={{
        url: 'http://test.dev',
        method: 'POST',
        headers: {
          Authorization: 'Bearer',
        },
        fields: {
          test: 'test',
        },
      }}
      uploadOnSelection={true}
      onComplete={() => wasCompleted = true}
    >
      {({ onFiles, startUpload, progress, complete, canceled, failed }) => {
        if (progress) progressValue = progress;
        return (
          <UploadField onFiles={onFiles}>
            <div>
              Click here and select a file!
            </div>
          </UploadField>
        );
      }}
    </Uploader>
  );

  output
    .find('input')
    .simulate('change', { target: { files: [{ name: 'test ' }] } });

  await sleep(500);
  expect(progressValue).toEqual(50);

  expect(wasCompleted).toEqual(true);
});

test('doesnt upload unless upload button is clicked', async () => {
  let progressValue = 0;
  let wasCompleted = false;

  const output = mount(
    <Uploader
      request={{
        url: 'http://test.dev',
        method: 'POST',
      }}
      uploadOnSelection={false}
      onComplete={() => wasCompleted = true}
    >
      {({ onFiles, startUpload, progress, complete, canceled, failed }) => {
        if (progress) progressValue = progress;
        return (
          <div>
            <UploadField onFiles={onFiles}>
              <div>
                Click here and select a file!
              </div>
            </UploadField>
            <div id="start" onClick={startUpload} />
          </div>
        );
      }}
    </Uploader>
  );

  output
    .find('input')
    .simulate('change', { target: { files: [{ name: 'test ' }] } });

  await sleep(500);
  expect(progressValue).toEqual(0);

  expect(wasCompleted).toEqual(false);

  output.find('#start').simulate('click');

  await sleep(500);
  expect(progressValue).toEqual(50);

  expect(wasCompleted).toEqual(true);
});

test('does nothing if no files are selected', async () => {
  const output = mount(
    <Uploader
      request={{
        url: 'http://test.dev',
        method: 'POST',
      }}
      uploadOnSelection={false}
      onComplete={() => wasCompleted = true}
    >
      {({ onFiles, startUpload, progress, complete, canceled, failed }) => {
        if (progress) progressValue = progress;
        return (
          <div>
            <UploadField onFiles={onFiles}>
              <div>
                Click here and select a file!
              </div>
            </UploadField>
            <div id="start" onClick={startUpload} />
          </div>
        );
      }}
    </Uploader>
  );

  output.find('#start').simulate('click');
});

test('returns failed on bad request', async () => {
  let didFail;

  const output = mount(
    <Uploader
      request={{
        url: 'http://fail.dev',
        method: 'POST',
      }}
      uploadOnSelection={true}
    >
      {({ onFiles, startUpload, progress, complete, canceled, failed }) => {
        if (failed) didFail = true;
        return (
          <div>
            <UploadField onFiles={onFiles}>
              <div>
                Click here and select a file!
              </div>
            </UploadField>
          </div>
        );
      }}
    </Uploader>
  );

  output
    .find('input')
    .simulate('change', { target: { files: [{ name: 'test ' }] } });

  await sleep(500);

  expect(didFail).toEqual(true);
});

test('returns canceled on aborted request', async () => {
  let didAbort;

  const output = mount(
    <Uploader
      request={{
        url: 'http://abort.dev',
        method: 'POST',
      }}
      uploadOnSelection={true}
    >
      {({ onFiles, startUpload, progress, complete, canceled, failed }) => {
        if (canceled) didAbort = true;
        return (
          <div>
            <UploadField onFiles={onFiles}>
              <div>
                Click here and select a file!
              </div>
            </UploadField>
          </div>
        );
      }}
    </Uploader>
  );

  output
    .find('input')
    .simulate('change', { target: { files: [{ name: 'test ' }] } });

  await sleep(500);

  expect(didAbort).toEqual(true);
});

test('defaults to a post request', async () => {
  const output = mount(
    <Uploader
      request={{
        url: 'http://test.dev',
      }}
      uploadOnSelection={true}
    >
      {({ onFiles, startUpload, progress, complete, canceled, failed }) => {
        return (
          <div>
            <UploadField onFiles={onFiles}>
              <div>
                Click here and select a file!
              </div>
            </UploadField>
          </div>
        );
      }}
    </Uploader>
  );

  output
    .find('input')
    .simulate('change', { target: { files: [{ name: 'test ' }] } });
});

test('returns files after selection', async () => {
  let returnsFiles = false;
  const output = mount(
    <Uploader
      request={{
        url: 'http://test.dev',
      }}
      uploadOnSelection={true}
    >
      {({ onFiles, files }) => {
        if (files) returnsFiles = true;
        return (
          <div>
            <UploadField onFiles={onFiles}>
              <div>
                Click here and select a file!
              </div>
            </UploadField>
          </div>
        );
      }}
    </Uploader>
  );

  output
    .find('input')
    .simulate('change', { target: { files: [{ name: 'test ' }] } });

  expect(returnsFiles).toEqual(true);
  await sleep(500);
});
