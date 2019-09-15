'use strict';

import * as vscode from 'vscode';
import * as aes from 'aes-js';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	const cmdEncryptdisposable = vscode.commands.registerCommand('extension.file_encrypt', async function () {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const content = document.getText();
			const cbytes = aes.utils.utf8.toBytes(content);

			const key256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
				16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
				29, 30, 31];

			try {
				var aesCtr = new aes.ModeOfOperation.ctr(key256, new aes.Counter(5));
				var encryptedBytes = aesCtr.encrypt(cbytes);

				const encryptedText = aes.utils.hex.fromBytes(encryptedBytes);

				// let invalidRange = new vscode.Range(0, 0, document.lineCount, 0);
				// let fullRange = document.validateRange(invalidRange);
				// editor.edit(edit => edit.replace(fullRange, encryptedText));

				const newFile = vscode.Uri.parse('untitled:' + path.join(vscode.workspace.rootPath || "./", 'file.dat'));
				vscode.workspace.openTextDocument(newFile).then(document => {
					const edit = new vscode.WorkspaceEdit();
					edit.insert(newFile, new vscode.Position(0, 0), encryptedText);
					return vscode.workspace.applyEdit(edit).then(success => {
						if (success) {
							vscode.window.showTextDocument(document);
						} else {
							vscode.window.showInformationMessage('Error while writing encrypted file.dat');
						}
					}, fail => {
						vscode.window.showInformationMessage('Error while writing encrypted file.dat');
					});
				});

			} catch (e) {
				console.log(e);
			}
		}
	});

	const cmdDecryptdisposable = vscode.commands.registerCommand('extension.file_decrypt', async function () {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const content = editor.document.getText();
			const cbytes = aes.utils.hex.toBytes(content);

			const key256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
				16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
				29, 30, 31];

			try {
				var aesCtr = new aes.ModeOfOperation.ctr(key256, new aes.Counter(5));
				var decryptedBytes = aesCtr.decrypt(cbytes);

				const decryptedText = aes.utils.utf8.fromBytes(decryptedBytes);

				// let invalidRange = new vscode.Range(0, 0, document.lineCount, 0);
				// let fullRange = document.validateRange(invalidRange);
				// editor.edit(edit => edit.replace(fullRange, decryptedText));

				const newFile = vscode.Uri.parse('untitled:' + path.join(vscode.workspace.rootPath || "./", 'file.dat.txt'));
				vscode.workspace.openTextDocument(newFile).then(document => {
					const edit = new vscode.WorkspaceEdit();
					edit.insert(newFile, new vscode.Position(0, 0), decryptedText);
					return vscode.workspace.applyEdit(edit).then(success => {
						if (success) {
							vscode.window.showTextDocument(document);
						} else {
							vscode.window.showInformationMessage('Error while writing decrypting file.dat');
						}
					}, fail => {
						vscode.window.showInformationMessage('Error while writing decrypting file.dat');
					});
				});

			} catch (e) {
				console.log(e);
			}
		}
	});

	context.subscriptions.push(cmdEncryptdisposable);
	context.subscriptions.push(cmdDecryptdisposable);

}